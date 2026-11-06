// Media and motion budgets (build plan, "Media and motion pass", AC-P1 to AC-P17). Exit code 1 when one regresses.
//   npm run qa:media                         builds, serves `vite preview`, asserts, stops the server
//   node qa/media.test.mjs http://host:port  asserts against a server that is already running
//   QA_CHANNEL=chrome npm run qa:media       the same in the installed Chrome (or msedge): the VP9 decode path differs from the bundled one
// Needs the dev dependency `playwright` and its Chromium. Ceilings live in qa/media-budget.json.
// Not scripted, on purpose: AC-P3 (loop PSNR), AC-P12 (contact sheets) and AC-P18 (spend and rights) are looked at by
// the people who render the media; media-src/scripts/verify.mjs holds the ffprobe and PSNR run.
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright";

const PORT = 4175;
const given = process.argv[2];
const base = (given || `http://localhost:${PORT}`).replace(/\/$/, "");
const budget = JSON.parse(readFileSync("qa/media-budget.json", "utf8"));

let server;
if (!given) {
  const win = process.platform === "win32";
  const npm = win ? "npm.cmd" : "npm";
  const build = spawnSync(npm, ["run", "build", "--", "--base", "/"], { stdio: "inherit", shell: win });
  if (build.status !== 0) process.exit(build.status ?? 1);
  server = spawn(npm, ["run", "preview", "--", "--base", "/", "--port", String(PORT), "--strictPort"], { stdio: "ignore", shell: win });
  for (let i = 0; i < 60; i++) {
    if (await fetch(base + "/").then((r) => r.ok, () => false)) break;
    await new Promise((r) => setTimeout(r, 500));
  }
}
const stopServer = () => {
  if (!server) return;
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  else server.kill();
};

const failures = [];
const report = [];
const check = (cond, message) => {
  if (!cond) failures.push(message);
};
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const MEDIA = /\/media\/(banners|cards|posters)\//;
const CLIP = /\.(mp4|webm)(\?|$)/;
const mediaRoutes = Object.keys(budget.routes).filter((r) => r.startsWith("/"));
const bannerRoutes = ["/bonuses", "/housing", "/find-buddy", "/how-it-works"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const desktop = { viewport: { width: 1440, height: 900 } };
const contexts = [
  ["390", phone],
  ["1440", desktop],
];

/** Scrolls the whole page in steps so every lazy image and every observer gets its turn. */
async function scrollThrough(page) {
  for (let i = 0; i < 60; i++) {
    const done = await page.evaluate(() => {
      window.scrollBy(0, innerHeight * 0.7);
      return innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    });
    await page.waitForTimeout(220);
    if (done) break;
  }
}

/** Collects every media request: URL, when it started against `load`, and the bytes it brought. */
function watchMedia(page) {
  const seen = { all: [], pending: [], loaded: false };
  page.on("load", () => {
    seen.loaded = true;
  });
  page.on("request", (request) => {
    if (MEDIA.test(request.url())) seen.all.push({ url: request.url(), beforeLoad: !seen.loaded, bytes: 0 });
  });
  page.on("requestfinished", (request) => {
    if (!MEDIA.test(request.url())) return;
    seen.pending.push(
      request.sizes().then((sizes) => {
        const entry = seen.all.find((e) => e.url === request.url() && !e.counted);
        if (entry) {
          entry.bytes = sizes.responseBodySize;
          entry.counted = true;
        }
      }),
    );
  });
  return {
    seen,
    async settle() {
      await Promise.all(seen.pending);
    },
    bytes: (only) => seen.all.filter(only || (() => true)).reduce((sum, e) => sum + e.bytes, 0),
    count: (only) => seen.all.filter(only || (() => true)).length,
  };
}

// QA_CHANNEL=chrome (or msedge) runs the whole file in the installed browser instead of the bundled Chromium.
const browser = await chromium.launch({ channel: process.env.QA_CHANNEL || undefined });

try {
  // AC-P1 + the MP4 part of AC-P2: every file exists under its ceiling, with `moov` before `mdat`.
  {
    let files = 0;
    for (const group of Object.values(budget.files)) {
      for (const name of group.names) {
        for (const [suffix, ceiling] of Object.entries(group.ceilings)) {
          const path = `${group.dir}/${name}${suffix}`;
          if (!existsSync(path)) {
            failures.push(`AC-P1 ${path}: missing`);
            continue;
          }
          files++;
          const size = statSync(path).size;
          if (size > ceiling) failures.push(`AC-P1 ${path}: ${kb(size)} over ${kb(ceiling)}`);
          if (suffix === ".mp4") {
            const data = readFileSync(path);
            let offset = 0;
            let first = "";
            while (offset + 8 <= data.length && !first) {
              const type = data.toString("latin1", offset + 4, offset + 8);
              if (type === "moov" || type === "mdat") first = type;
              offset += Math.max(8, data.readUInt32BE(offset));
            }
            if (first !== "moov") failures.push(`AC-P2 ${path}: ${first || "no"} box before moov (not faststart)`);
          }
        }
      }
    }
    report.push(`AC-P1/P2   ${files} media files under their ceilings, every MP4 faststart`);
  }

  // AC-P4 and AC-P5: requests until `load`, and bytes after a full scroll and 6 s.
  for (const route of mediaRoutes) {
    const limits = budget.routes[route];
    for (const [label, options] of contexts) {
      const ctx = await browser.newContext(options);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const media = watchMedia(page);
      await page.goto(base + route, { waitUntil: "load" });
      await media.settle();
      const before = media.seen.all.filter((e) => e.beforeLoad);
      const clipsBefore = before.filter((e) => CLIP.test(e.url));
      const beforeBytes = before.reduce((sum, e) => sum + e.bytes, 0);
      check(clipsBefore.length === 0, `AC-P4 ${route} @${label}: ${clipsBefore.length} clip requests before load`);
      check(beforeBytes <= limits.beforeLoad, `AC-P4 ${route} @${label}: ${kb(beforeBytes)} of media before load, over ${kb(limits.beforeLoad)}`);
      const preloads = await page.evaluate(() => [...document.querySelectorAll('link[rel="preload"]')].map((l) => l.href).filter((h) => /\/media\//.test(h)));
      check(preloads.length === 0, `AC-P4 ${route} @${label}: media preload ${preloads[0]}`);

      await scrollThrough(page);
      await page.waitForTimeout(6000);
      await media.settle();
      const total = media.bytes();
      const most = limits[`most${label}`];
      check(total <= most, `AC-P5 ${route} @${label}: ${kb(total)} of media after a full scroll, over ${kb(most)}`);
      check(errors.length === 0, `AC-P5 ${route} @${label}: page error ${errors[0]}`);
      report.push(`${route.padEnd(14)} @${label.padEnd(4)} before load ${kb(beforeBytes).padStart(8)} (max ${kb(limits.beforeLoad)}), full scroll ${kb(total).padStart(9)} (max ${kb(most)})`);
      await ctx.close();
    }
  }

  // Routes with no media: nothing requested, 404 included.
  for (const route of budget.routes.none) {
    const ctx = await browser.newContext(phone);
    const page = await ctx.newPage();
    const media = watchMedia(page);
    await page.goto(base + route, { waitUntil: "networkidle" });
    await scrollThrough(page);
    await media.settle();
    check(media.count() === 0, `AC-P5 ${route}: ${media.count()} media requests on a route that has none`);
    await ctx.close();
  }

  // AC-P6: the DOM contract, on every banner route and on the cards.
  for (const route of bannerRoutes) {
    for (const [label, options] of contexts) {
      const ctx = await browser.newContext(options);
      const page = await ctx.newPage();
      await page.goto(base + route, { waitUntil: "load" });
      // The banner is in view from the first frame, so its clip may start once load and idle have passed.
      await page.waitForFunction(() => document.querySelector("video") && !document.querySelector("video").paused, null, { timeout: 12000 }).catch(() => {});
      const v = await page.evaluate(() => {
        const el = document.querySelector("video");
        if (!el) return null;
        return {
          muted: el.muted,
          playsInline: el.playsInline,
          autoplay: el.hasAttribute("autoplay"),
          loop: el.loop,
          width: el.getAttribute("width"),
          height: el.getAttribute("height"),
          paused: el.paused,
          poster: el.getAttribute("poster"),
          sources: [...el.querySelectorAll("source")].map((s) => s.type),
          preload: el.preload,
        };
      });
      const tag = `AC-P6 ${route} @${label}`;
      if (!v) failures.push(`${tag}: no <video> after the banner came into view`);
      else {
        check(v.muted && v.playsInline && !v.autoplay, `${tag}: muted ${v.muted}, playsInline ${v.playsInline}, autoplay ${v.autoplay}`);
        check(v.loop === true, `${tag}: a banner must loop`);
        check(v.width === "854" && v.height === "480", `${tag}: width/height ${v.width}x${v.height}`);
        check(Boolean(v.poster), `${tag}: no poster`);
        check(v.sources.join() === "video/webm,video/mp4", `${tag}: sources ${v.sources.join()}`);
        check(v.paused === false, `${tag}: paused while in view`);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(700);
        const stopped = await page.evaluate(() => document.querySelector("video")?.paused ?? true);
        check(stopped, `${tag}: still playing after scrolling away`);
      }
      await ctx.close();
    }
  }
  {
    // Cards: no <video> before the first intersect; no `loop`; they play only from 768 px.
    const ctx = await browser.newContext(desktop);
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "load" });
    await page.waitForTimeout(2800);
    // The hero desk's own scrub clip (hero pass) is judged by qa/hero.test.mjs.
    const before = await page.evaluate(() => document.querySelectorAll("video:not([data-hero-desk] video)").length);
    check(before === 0, `AC-P6 / @1440: ${before} <video> before the first intersect`);
    await page.locator("figure[data-mode=once]").first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector("figure[data-mode=once] video"), null, { timeout: 8000 }).catch(() => {});
    const card = await page.evaluate(() => {
      const el = document.querySelector("figure[data-mode=once] video");
      return el && { loop: el.loop, muted: el.muted, autoplay: el.hasAttribute("autoplay"), width: el.getAttribute("width"), height: el.getAttribute("height") };
    });
    if (!card) failures.push("AC-P6 / @1440: no card <video> after its row came into view");
    else {
      check(card.loop === false, "AC-P6 /: a card must not loop (WCAG 2.2.2)");
      check(card.muted && !card.autoplay && card.width === "480" && card.height === "360", `AC-P6 /: card attributes ${JSON.stringify(card)}`);
    }
    await ctx.close();
    const small = await browser.newContext(phone);
    const sp = await small.newPage();
    await sp.goto(base + "/", { waitUntil: "load" });
    await scrollThrough(sp);
    check((await sp.evaluate(() => document.querySelectorAll("video").length)) === 0, "AC-P6 / @390: cards must be posters on a phone");
    await small.close();
  }

  // AC-P6b: a clip that starts must keep playing. A decoder can accept the type and then fail on the stream (Chrome's VP9 path
  // did, a frame after `playing`), so "paused === false" once is not proof. 1.6 s after `playing` the figure must still carry
  // `data-playing`, the clip must have advanced, and no `error` may have fired. Then the same with the WebM refused, and with a
  // decode error forced on the WebM after `playing`: the MP4 must take over and keep playing.
  {
    const recordErrors = () => {
      window.__videoErrors = [];
      document.addEventListener(
        "error",
        (e) => {
          const t = e.target;
          if (t && (t.tagName === "VIDEO" || t.tagName === "SOURCE")) window.__videoErrors.push({ tag: t.tagName, src: t.currentSrc || t.src, el: t, owner: t.tagName === "SOURCE" ? t.parentElement : t });
        },
        true,
      );
    };
    const forceDecodeError = () => {
      document.addEventListener(
        "playing",
        (e) => {
          const v = e.target;
          if (v.tagName !== "VIDEO" || !/\.webm(\?|$)/.test(v.currentSrc) || v.__forced) return;
          v.__forced = true;
          setTimeout(() => {
            Object.defineProperty(v, "error", { configurable: true, get: () => ({ code: 3, message: "PIPELINE_ERROR_DECODE (forced by the test)" }) });
            v.dispatchEvent(new Event("error"));
          }, 15);
        },
        true,
      );
    };
    const cases = [
      { name: "webm", prepare: async () => {}, final: /\.webm(\?|$)/, videoErrors: 0, sourceErrors: 0 },
      { name: "webm refused", prepare: (page) => page.route(/\.webm(\?|$)/, (route) => route.abort()), final: /\.mp4(\?|$)/, videoErrors: 0, sourceErrors: 1 },
      { name: "webm decode error", init: forceDecodeError, final: /\.mp4(\?|$)/, videoErrors: 1, sourceErrors: 0 },
    ];
    const targets = [
      { route: "/housing", figure: "figure[data-mode=loop]", tail: async () => {} },
      { route: "/", figure: "figure[data-mode=once]", tail: (page) => page.locator("figure[data-mode=once]").first().scrollIntoViewIfNeeded() },
    ];
    for (const c of cases) {
      for (const t of targets) {
        const ctx = await browser.newContext(desktop);
        await ctx.addInitScript(recordErrors);
        if (c.init) await ctx.addInitScript(c.init);
        const page = await ctx.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        if (c.prepare) await c.prepare(page);
        await page.goto(base + t.route, { waitUntil: "load" });
        await t.tail(page);
        const tag = `AC-P6b ${t.route} ${c.name}`;
        const playing = `${t.figure}[data-playing] video`;
        // The settled clip is the one on the final source: the forced case plays the WebM first, then the MP4.
        const settled = await page
          .waitForFunction(
            ([sel, re]) => {
              const v = document.querySelector(sel);
              return v && new RegExp(re).test(v.currentSrc) && !v.paused ? v.currentTime : false;
            },
            [playing, c.final.source],
            { timeout: 15000, polling: 100 },
          )
          .then((h) => h.jsonValue())
          .catch(() => null);
        if (settled === null) {
          failures.push(`${tag}: no clip on ${c.final} with data-playing within 15 s`);
        } else {
          await page.waitForTimeout(1600);
          const after = await page.evaluate(
            ([sel, figure]) => {
              const v = document.querySelector(sel);
              return {
                playing: Boolean(v),
                paused: v ? v.paused : null,
                time: v ? v.currentTime : null,
                src: v ? v.currentSrc : "",
                dataPlaying: document.querySelector(`${figure}[data-playing]`) !== null,
                // The home page starts several cards at once; the checks below are about the one <video> being watched.
                errors: window.__videoErrors.filter((e) => e.owner === v).map((e) => ({ tag: e.tag, src: e.src })),
                allErrors: window.__videoErrors.length,
              };
            },
            [playing, t.figure],
          );
          check(after.playing && after.dataPlaying, `${tag}: 1.6 s after playing, no <video> in a figure with data-playing`);
          check(after.time !== null && after.time > settled + 0.8, `${tag}: the clip did not advance (${settled} to ${after.time})`);
          check(c.final.test(after.src), `${tag}: playing ${after.src}, expected ${c.final}`);
          const video = after.errors.filter((e) => e.tag === "VIDEO").length;
          const source = after.errors.filter((e) => e.tag === "SOURCE").length;
          check(video === c.videoErrors, `${tag}: ${video} <video> error events, expected ${c.videoErrors}`);
          check(source <= c.sourceErrors, `${tag}: ${source} <source> error events, expected at most ${c.sourceErrors}`);
          check(c.videoErrors > 0 || c.sourceErrors > 0 || after.allErrors === 0, `${tag}: ${after.allErrors} error events on a run that expects none`);
          check(errors.length === 0, `${tag}: page error ${errors[0]}`);
        }
        await ctx.close();
      }
    }
    report.push("AC-P6b     a banner on /housing and a card on / keep playing 1.6 s after `playing` with data-playing and no error; also with the WebM refused and with a decode error forced on it (the MP4 takes over)");
  }

  // AC-P7: poster only, four ways, on every route that has media.
  {
    const ways = [
      ["reduced motion", { reducedMotion: "reduce" }, null],
      [
        "saveData",
        {},
        () => Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true, effectiveType: "4g", addEventListener() {}, removeEventListener() {} } }),
      ],
      ["still setting", {}, () => localStorage.setItem("c4s.ledger.still", "1")],
      [
        "3g",
        {},
        () => Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: false, effectiveType: "3g", addEventListener() {}, removeEventListener() {} } }),
      ],
    ];
    const expected = { "/": 4, "/bonuses": 1, "/housing": 1, "/find-buddy": 1, "/how-it-works": 5 };
    for (const [name, extra, init] of ways) {
      for (const [label, options] of contexts) {
        for (const route of Object.keys(expected)) {
          const ctx = await browser.newContext({ ...options, ...extra });
          if (init) await ctx.addInitScript(init);
          const page = await ctx.newPage();
          const media = watchMedia(page);
          await page.goto(base + route, { waitUntil: "load" });
          await scrollThrough(page);
          await page.waitForTimeout(label === "1440" ? 2200 : 1700);
          await media.settle();
          const state = await page.evaluate(() => ({
            videos: document.querySelectorAll("video").length,
            ok: document.querySelectorAll('figure.media-frame[data-media="ok"] img').length,
          }));
          const tag = `AC-P7 ${name} ${route} @${label}`;
          check(state.videos === 0, `${tag}: ${state.videos} <video>`);
          check(media.count((e) => CLIP.test(e.url)) === 0, `${tag}: ${media.count((e) => CLIP.test(e.url))} clip requests`);
          check(state.ok === expected[route], `${tag}: ${state.ok} posters, expected ${expected[route]}`);
          await ctx.close();
        }
      }
    }
    report.push("AC-P7      poster only under reduced motion, saveData, the still setting and 3g, on 5 routes at 390 and 1440");
  }

  // AC-P8: blocked, and answered with index.html (the SPA fallback returns 200 for a missing file).
  {
    const cases = [
      ["aborted", (route) => route.abort()],
      ["html 200", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><html><body></body></html>" })],
    ];
    for (const [name, handler] of cases) {
      for (const [label, options] of contexts) {
        for (const route of Object.keys({ "/": 0, "/bonuses": 0, "/housing": 0, "/find-buddy": 0, "/how-it-works": 0, "/blog": 0 })) {
          const ctx = await browser.newContext(options);
          const page = await ctx.newPage();
          const errors = [];
          page.on("pageerror", (e) => errors.push(e.message));
          await page.route(MEDIA, handler);
          await page.goto(base + route, { waitUntil: "load" });
          await page.waitForTimeout(1200);
          await scrollThrough(page);
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(400);
          const state = await page.evaluate(() => {
            const shown = [...document.querySelectorAll("figure.media-frame")].filter((f) => getComputedStyle(f).display !== "none");
            const stills = [...document.querySelectorAll("img.media-still")];
            const h1 = document.querySelector("h1")?.getBoundingClientRect();
            const lead = document.querySelector("header .t-lead")?.getBoundingClientRect();
            return {
              shown: shown.length,
              stills: stills.length,
              overflow: document.documentElement.scrollWidth > innerWidth,
              h1Visible: Boolean(h1 && h1.bottom > 0 && h1.top < innerHeight),
              leadVisible: lead ? lead.bottom > 0 && lead.top < innerHeight : true,
              orphanToggle: [...document.querySelectorAll("header label")].filter((l) => l.offsetParent).length,
            };
          });
          const tag = `AC-P8 ${name} ${route} @${label}`;
          check(state.shown === 0, `${tag}: ${state.shown} frames still shown`);
          check(state.stills === 0, `${tag}: ${state.stills} blog stills still rendered`);
          check(!state.overflow, `${tag}: horizontal overflow`);
          check(state.orphanToggle === 0, `${tag}: "Turn animations off" left in the header with nothing to stop`);
          check(state.h1Visible && state.leadVisible, `${tag}: h1 or lead pushed out of view`);
          check(errors.length === 0, `${tag}: page error ${errors[0]}`);
          await ctx.close();
        }
      }
    }
    // A clip alone failing leaves the poster, with no error.
    const ctx = await browser.newContext(desktop);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route(CLIP, (route) => route.fulfill({ status: 200, contentType: "text/html", body: "x" }));
    await page.goto(base + "/housing", { waitUntil: "load" });
    await page.waitForTimeout(3500);
    const left = await page.evaluate(() => ({
      poster: document.querySelectorAll('figure[data-media="ok"] img').length,
      videos: document.querySelectorAll("video").length,
    }));
    check(left.poster === 1, "AC-P8 clip failing: poster gone");
    check(left.videos === 0, "AC-P8 clip failing: a dead <video> stayed in the page");
    check(errors.length === 0, `AC-P8 clip failing: page error ${errors[0]}`);
    await ctx.close();
    report.push("AC-P8      blocked and html-200 media leave no box, no overflow, no error; a failed clip leaves the poster");
  }

  // AC-P9: CLS with the media delayed 2 s, and LCP under throttling.
  {
    const clsRoutes = [...mediaRoutes, "/nowhere"];
    for (const [label, options] of contexts) {
      for (const route of clsRoutes) {
        const ctx = await browser.newContext(options);
        await ctx.addInitScript(() => {
          window.__cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
          }).observe({ type: "layout-shift", buffered: true });
        });
        const page = await ctx.newPage();
        await page.route(MEDIA, async (r) => {
          await sleep(2000);
          r.continue().catch(() => {});
        });
        await page.goto(base + route, { waitUntil: "load" });
        await scrollThrough(page);
        await page.waitForTimeout(3500);
        const cls = await page.evaluate(() => window.__cls);
        check(cls <= budget.limits.cls, `AC-P9 ${route} @${label}: CLS ${cls.toFixed(3)} over ${budget.limits.cls}`);
        report.push(`CLS        ${route.padEnd(14)} @${label.padEnd(4)} ${cls.toFixed(3)} (max ${budget.limits.cls}, media delayed 2 s)`);
        await ctx.close();
      }
    }
    for (const route of bannerRoutes) {
      const ctx = await browser.newContext(phone);
      await ctx.addInitScript(() => {
        window.__lcp = null;
        new PerformanceObserver((list) => {
          const last = list.getEntries().at(-1);
          window.__lcp = { time: last.startTime, tag: last.element?.tagName ?? "", url: last.url };
        }).observe({ type: "largest-contentful-paint", buffered: true });
      });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await page.goto(base + route, { waitUntil: "load" });
      await page.waitForTimeout(3000);
      const lcp = await page.evaluate(() => window.__lcp);
      check(lcp && lcp.time <= budget.limits.lcpMs, `AC-P9 ${route} @390 throttled: LCP ${lcp ? Math.round(lcp.time) : "none"} ms over ${budget.limits.lcpMs}`);
      check(!lcp || lcp.tag !== "VIDEO", `AC-P9 ${route}: the LCP element is a <video>`);
      report.push(`LCP        ${route.padEnd(14)} @390  ${lcp ? Math.round(lcp.time) : "?"} ms, ${lcp?.tag}, headless, 1.6 Mbps / 150 ms / 4x CPU, one run`);
      await ctx.close();
    }
  }

  // AC-P10: display size, at seven widths.
  {
    for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      for (const route of ["/", ...bannerRoutes]) {
        const page = await ctx.newPage();
        await page.goto(base + route, { waitUntil: "load" });
        await page.waitForTimeout(400);
        const m = await page.evaluate(() => {
          const rect = (el) => el.getBoundingClientRect();
          const banner = [...document.querySelectorAll("figure[data-mode=loop]")].map((f) => rect(f).width);
          const cards = [...document.querySelectorAll("figure[data-mode=once]")].filter((f) => getComputedStyle(f).display !== "none").map((f) => rect(f).width);
          const h1 = document.querySelector("header h1");
          const column = h1?.parentElement;
          return {
            banner,
            cards,
            h1Fits: h1 ? h1.scrollWidth <= column.clientWidth + 1 : true,
            overlap: (() => {
              const fig = document.querySelector("header figure");
              if (!h1 || !fig) return false;
              const range = document.createRange();
              range.selectNodeContents(h1);
              return [...range.getClientRects()].some((r) => r.right > rect(fig).left && r.bottom > rect(fig).top && r.top < rect(fig).bottom && r.left < rect(fig).left);
            })(),
          };
        });
        const tag = `AC-P10 ${route} @${width}`;
        m.banner.forEach((w) => check(w <= budget.limits.bannerMaxWidth + 0.5, `${tag}: banner ${Math.round(w)} px wide, over ${budget.limits.bannerMaxWidth}`));
        m.cards.forEach((w) => check(w <= budget.limits.cardMaxWidth + 0.5, `${tag}: card ${Math.round(w)} px wide, over ${budget.limits.cardMaxWidth}`));
        check(m.h1Fits, `${tag}: the h1 runs past its column`);
        check(!m.overlap, `${tag}: the h1 runs into the banner`);
        await page.close();
      }
      await ctx.close();
    }
    report.push("AC-P10     banner at most 854 and card at most 240 wide at 320, 390, 768, 1024, 1280, 1440, 1920; h1 inside its column");
  }

  // AC-P15: the still setting, one key for the ledger and every clip.
  {
    const ctx = await browser.newContext(desktop);
    const page = await ctx.newPage();
    await page.goto(base + "/housing", { waitUntil: "load" });
    await page.waitForFunction(() => document.querySelector("video") && !document.querySelector("video").paused, null, { timeout: 12000 }).catch(() => {});
    check(await page.evaluate(() => Boolean(document.querySelector("video"))), "AC-P15: no clip playing to stop");
    await page.getByLabel("Turn animations off").check();
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    check((await page.evaluate(() => document.querySelectorAll("video").length)) === 0, "AC-P15: a playing banner survived the setting for two frames");
    check((await page.evaluate(() => localStorage.getItem("c4s.ledger.still"))) === "1", "AC-P15: the key is not c4s.ledger.still = 1");
    await page.reload({ waitUntil: "load" });
    await page.waitForTimeout(2800);
    check((await page.evaluate(() => document.querySelectorAll("video").length)) === 0, "AC-P15: a reload started a clip");
    check((await page.evaluate(() => document.querySelectorAll('figure[data-media="ok"] img').length)) === 1, "AC-P15: no poster after reload");
    await page.goto(base + "/", { waitUntil: "load" });
    check(await page.getByLabel("Turn animations off").isChecked(), "AC-P15: / does not share the setting with /housing");
    await page.getByLabel("Turn animations off").uncheck();
    await page.goto(base + "/housing", { waitUntil: "load" });
    await page.waitForFunction(() => document.querySelector("video"), null, { timeout: 12000 }).catch(() => {});
    check(await page.evaluate(() => Boolean(document.querySelector("video"))), "AC-P15: clearing the setting on / did not restart the clip on /housing");
    await ctx.close();
    report.push("AC-P15     the setting stops a playing banner within two frames, survives a reload, and is shared by / and /housing");
  }

  // AC-P16: M4 to M7.
  {
    const probe = {
      fold: (page) =>
        page.evaluate(async () => {
          const d = document.querySelector("details.fold:not([open])");
          if (!d) return null;
          const size = () => parseFloat(getComputedStyle(d, "::details-content").blockSize) || 0;
          d.querySelector("summary").click();
          await new Promise((r) => setTimeout(r, 90));
          const mid = size();
          await new Promise((r) => setTimeout(r, 700));
          return { mid, end: size(), duration: getComputedStyle(d, "::details-content").transitionDuration };
        }),
    };
    {
      const ctx = await browser.newContext(phone);
      const page = await ctx.newPage();
      await page.goto(base + "/how-it-works", { waitUntil: "networkidle" });
      const fold = await probe.fold(page);
      check(fold && fold.mid > 0 && fold.mid < fold.end - 1, `AC-P16 M4: fold height did not animate (mid ${fold?.mid}, end ${fold?.end})`);
      await page.goto(base + "/legal", { waitUntil: "networkidle" });
      const imprint = await page.evaluate(() => [...document.querySelectorAll("details.fold")].filter((d) => d.querySelector("summary")?.textContent.trim() === "Imprint").map((d) => d.open));
      check(imprint.length === 1 && imprint[0] === true, "AC-P16 M4: Imprint is not open on load");
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1800);
      const mark = await page.evaluate(() => {
        const el = document.querySelector("[data-hero-mark]");
        return el && { transform: getComputedStyle(el).transform, opacity: getComputedStyle(el).opacity, imgTransform: el.querySelector("img")?.style.transform ?? "" };
      });
      check(mark && mark.transform === "none" && Number(mark.opacity) === 1, `AC-P16 M6: [data-hero-mark] did not settle (${JSON.stringify(mark)})`);
      check(mark && mark.imgTransform === "", "AC-P16 M6: the hero img was moved; only its wrapper may be");
      await page.locator("#your-ledger").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1800);
      const rules = await page.evaluate(() =>
        [...document.querySelectorAll(".written-row")]
          .filter((li) => getComputedStyle(li).display !== "none" && getComputedStyle(li).visibility !== "hidden")
          .map((li) => {
            const t = getComputedStyle(li, "::before").transform;
            return t === "none" ? 1 : new DOMMatrix(t).a;
          }),
      );
      check(rules.length === 5 && rules.every((s) => s > 0.99), `AC-P16 M5: ledger rules at 1280: ${rules.join(",")}`);
      await ctx.close();
    }
    {
      const ctx = await browser.newContext(phone);
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "networkidle" });
      const shown = await page.evaluate(() => [...document.querySelectorAll(".written-row")].filter((li) => getComputedStyle(li).display !== "none").length);
      check(shown === 0, `AC-P16 M5: ${shown} blank ledger lines on a phone`);
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(base + "/nowhere", { waitUntil: "networkidle" });
      await page.waitForTimeout(1800);
      const offsets = await page.evaluate(() => [...document.querySelectorAll(".loader-mark path")].map((p) => getComputedStyle(p).strokeDashoffset));
      check(offsets.length === 7 && offsets.every((o) => o === "0px"), `AC-P16 M7: 404 strokes end at ${offsets.join(",")}`);
      await ctx.close();
    }
    {
      // All four static under reduced motion, from the first frame.
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "domcontentloaded" });
      await page.waitForSelector("[data-hero-mark]");
      const early = await page.evaluate(() => {
        const mark = document.querySelector("[data-hero-mark]");
        const rule = document.querySelector(".written-row");
        const t = getComputedStyle(rule, "::before").transform;
        return { mark: getComputedStyle(mark).transform, opacity: getComputedStyle(mark).opacity, rule: t === "none" ? 1 : new DOMMatrix(t).a };
      });
      check(early.mark === "none" && Number(early.opacity) === 1 && early.rule === 1, `AC-P16 reduced: hero mark or ledger rules are not at rest (${JSON.stringify(early)})`);
      await page.goto(base + "/legal", { waitUntil: "networkidle" });
      const fold = await page.evaluate(() => getComputedStyle(document.querySelector("details.fold"), "::details-content").transitionDuration);
      check(/^0s(, 0s)*$/.test(fold), `AC-P16 reduced: fold transition ${fold}`);
      await page.goto(base + "/nowhere", { waitUntil: "networkidle" });
      const loader = await page.evaluate(() => {
        const p = document.querySelector(".loader-mark path");
        return { animation: getComputedStyle(p).animationName, dash: getComputedStyle(p).strokeDasharray };
      });
      check(loader.animation === "none" && loader.dash === "none", `AC-P16 reduced: 404 mark ${JSON.stringify(loader)}`);
      await ctx.close();
    }
    report.push("AC-P16     fold height animates and Imprint opens on load; five ledger rules at 1280, none at 390; hero mark settles to none; 404 strokes end at 0; all static under reduced motion");
  }

  // AC-P11, AC-P13, AC-P14, AC-P17 (the parts a script can hold).
  {
    const content = JSON.parse(readFileSync("media-src/content.json", "utf8"));
    const strings = [...Object.values(content.eyebrows), ...Object.values(content.og)];
    check(strings.length === 6, `AC-P11: media-src/content.json holds ${strings.length} strings, expected 6`);
    const sources = execFileSync("git", ["grep", "-h", "-F", "-e", "", "origin/main", "--", "src"], { encoding: "utf8", maxBuffer: 1 << 28 });
    for (const s of strings) {
      check(sources.includes(s), `AC-P11: "${s}" is not on origin/main`);
      check(!/[0-9€]/.test(s.replace("Care4Students", "")), `AC-P11: "${s}" has a digit or a currency sign`);
    }

    const dist = readdirSync("dist/assets").filter((f) => f.endsWith(".js"));
    const remotion = dist.filter((f) => /remotion/i.test(readFileSync(`dist/assets/${f}`, "utf8")));
    check(remotion.length === 0, `AC-P13: remotion in dist/assets: ${remotion.join(", ")}`);
    const lockFree = !/remotion/i.test(readFileSync("package.json", "utf8"));
    check(lockFree, "AC-P13: package.json names remotion");
  }
} catch (error) {
  failures.push(`test run crashed: ${error?.stack || error}`);
} finally {
  await browser.close();
}

// `git grep` exits 1 when it finds nothing, which is the passing case here, so these run outside the try.
{
  const none = (args) => spawnSync("git", args, { encoding: "utf8" }).status === 1;
  check(none(["grep", "-q", "-E", "media-src|@remotion", "--", "src"]), "AC-P13: src/ imports media-src or @remotion");
  check(readFileSync("eslint.config.js", "utf8").includes('"media-src"'), "AC-P13: eslint.config.js does not ignore media-src");
  const frozen = spawnSync(
    "git",
    ["diff", "--quiet", "origin/main", "--", "src/contexts/AuthContext.tsx", "src/components/ProtectedRoute.tsx", ...readdirSync("src/pages").filter((f) => f.startsWith("Dashboard")).map((f) => `src/pages/${f}`)],
    { encoding: "utf8" },
  );
  check(frozen.status === 0, "AC-P17: AuthContext, ProtectedRoute or a Dashboard page differs from origin/main");

  try {
    const html = readFileSync("dist/index.html", "utf8");
    const entry = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
    const gz = gzipSync(readFileSync(`dist${entry}`), { level: 9 }).length;
    const max = budget.limits.entryJsGzipBaseline + budget.limits.entryJsGzipGrowthMax;
    check(gz <= max, `AC-P14: entry JS ${kb(gz)} gzip, over ${kb(max)}`);
    report.push(`AC-P14     entry JS ${kb(gz)} gzip (baseline ${kb(budget.limits.entryJsGzipBaseline)}, growth max ${kb(budget.limits.entryJsGzipGrowthMax)})`);
  } catch (error) {
    failures.push(`AC-P14: could not read dist/index.html (${error.message})`);
  }
}

// AC-P14, phone half: no GSAP on a phone, first-load JS within its ceiling. One more browser.
{
  const second = await chromium.launch();
  try {
    const ctx = await second.newContext(phone);
    const page = await ctx.newPage();
    const scripts = [];
    page.on("request", (r) => {
      if (/\.js(\?|$)/.test(new URL(r.url()).pathname)) scripts.push(new URL(r.url()).pathname);
    });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await scrollThrough(page);
    check(!scripts.some((s) => /HomeMotion|gsap/i.test(s)), `AC-P14: a phone requested the GSAP chunk (${scripts.filter((s) => /HomeMotion|gsap/i.test(s)).join(", ")})`);
    const total = scripts.reduce((sum, s) => (existsSync(`dist${s}`) ? sum + gzipSync(readFileSync(`dist${s}`), { level: 9 }).length : sum), 0);
    check(total <= budget.limits.firstLoadJsGzipMax390, `AC-P14: first-load JS at 390 is ${kb(total)} gzip, over ${kb(budget.limits.firstLoadJsGzipMax390)}`);
    report.push(`AC-P14     first-load JS at 390 / ${kb(total)} gzip (max ${kb(budget.limits.firstLoadJsGzipMax390)}), no GSAP chunk`);
    await ctx.close();
  } finally {
    await second.close();
    stopServer();
  }
}

console.log(report.join("\n"));
if (failures.length) {
  console.error("\nMedia budget failures:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log("\nMedia budgets OK: files, requests before load, bytes per route, DOM contract, poster-only runs, failure runs, CLS, LCP, display size, still setting, M4-M7.");
