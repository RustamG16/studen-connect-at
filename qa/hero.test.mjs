// The hero pass's acceptance criteria (build plan, "Hero pass" AC-H1 to AC-H23 and the addendum's AC-H24 to AC-H29). Exit code 1 when one fails.
//   npm run qa:hero                          builds with --base /, serves `vite preview`, asserts, stops the server
//   node qa/hero.test.mjs http://host:port   asserts against a server that is already running (its dist built with --base /)
//   QA_CHANNEL=chrome npm run qa:hero        the same in the installed Chrome: it plays H.264, so the MP4 half of the ladder (AC-H5 to AC-H7) runs
// Needs the dev dependency `playwright`, its Chromium (Firefox and WebKit if you want AC-H4 across engines), `ffprobe`, and git.
// Not scripted, on purpose: AC-H22 and AC-H29 (looked at by eye on contact sheets), the OCR half of AC-H27 when `tesseract` is not on the path,
// AC-H23 (the Higgsfield `transactions` before and after, in the producer's report), and real Safari.
// A test that cannot run in this browser (a codec it lacks) is reported as SKIPPED with the reason, never as a pass.
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { chromium, firefox, webkit } from "playwright";

const PORT = 4176;
const given = process.argv[2];
const base = (given || `http://localhost:${PORT}`).replace(/\/$/, "");
const PASS_BASE = "9be5e18"; // the commit before the hero build: "git diff is empty" is measured against it
const win = process.platform === "win32";
const npm = win ? "npm.cmd" : "npm";

let server;
if (!given) {
  const build = spawnSync(npm, ["run", "build", "--", "--base", "/"], { stdio: "inherit", shell: win, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  if (build.status !== 0) process.exit(build.status ?? 1);
  server = spawn(npm, ["run", "preview", "--", "--base", "/", "--port", String(PORT), "--strictPort"], { stdio: "ignore", shell: win, env: { ...process.env, MSYS_NO_PATHCONV: "1" } });
  for (let i = 0; i < 60; i++) {
    if (await fetch(base + "/").then((r) => r.ok, () => false)) break;
    await new Promise((r) => setTimeout(r, 500));
  }
}
const stopServer = () => {
  if (!server) return;
  if (win) spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  else server.kill();
};

const failures = [];
const report = [];
const skipped = [];
const check = (cond, message) => {
  if (!cond) failures.push(message);
};
const note = (line) => report.push(line);
const skip = (id, why) => {
  skipped.push(`${id}: ${why}`);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const git = (...args) => spawnSync("git", args, { encoding: "utf8" });

// ONLY=AC-H9,AC-H16 runs just those sections (substring match), for working on one criterion.
const only = process.env.ONLY?.split(",").filter(Boolean);
async function section(id, fn) {
  if (only && !only.some((o) => id.includes(o))) return;
  try {
    await fn();
  } catch (error) {
    failures.push(`${id}: threw ${String(error?.stack ?? error).split("\n").slice(0, 3).join(" / ")}`);
  }
}

const launchOptions = process.env.QA_CHANNEL ? { channel: process.env.QA_CHANNEL } : {};
const browser = await chromium.launch(launchOptions);
const channel = process.env.QA_CHANNEL || "chromium (bundled)";
note(`browser: ${channel}`);

// ---------------------------------------------------------------- helpers
const MEDIA_HERO = /\/media\/hero\//;
const CLIP = /\.(mp4|webm)(\?|$)/;
const FRAME_N = /\/media\/dragonfly\/s384\/frame-(\d\d)\.webp/;
const ALT = "Care4Students Dragonfly";
const phoneCtx = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };

/** A page with a ledger: every request with its size, and whether it started before `load`. */
async function open(options = {}, init) {
  const { net4g, ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...contextOptions });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  const ledger = { requests: [], loaded: false, pageErrors: [], consoleErrors: [], sizes: new Map() };
  page.on("load", () => (ledger.loaded = true));
  page.on("request", (request) => {
    // about:blank fires its own load: every main-frame navigation starts a fresh "before load" window.
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) ledger.loaded = false;
    ledger.requests.push({ url: request.url(), beforeLoad: !ledger.loaded, type: request.resourceType() });
  });
  // One protocol session does both jobs, because a second `Network.enable` resets the emulation. It gives bytes per URL (so a clip that
  // is still streaming, a range request that never "finishes", is counted too) and, with net4g, the connection Chrome's lazy-load
  // distance depends on: 1250 px on 4g, 3000 px when it is unknown (as in headless). The plan's "far below the lazy distance" is the 4g case.
  if (channel.startsWith("chrom") || process.env.QA_CHANNEL) {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    if (net4g) await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 20, downloadThroughput: 50 * 1024 * 1024, uploadThroughput: 10 * 1024 * 1024, connectionType: "cellular4g" });
    const byId = new Map();
    cdp.on("Network.requestWillBeSent", (e) => byId.set(e.requestId, e.request.url));
    cdp.on("Network.dataReceived", (e) => {
      const url = byId.get(e.requestId);
      if (url && e.encodedDataLength) ledger.sizes.set(url, (ledger.sizes.get(url) ?? 0) + e.encodedDataLength); // the protocol reports each chunk twice: raw and encoded
    });
    cdp.on("Network.loadingFinished", (e) => {
      const url = byId.get(e.requestId);
      if (url) ledger.sizes.set(url, Math.max(ledger.sizes.get(url) ?? 0, e.encodedDataLength - 300)); // minus its headers
    });
  }
  page.on("pageerror", (error) => ledger.pageErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error" && !/Failed to load resource|ERR_ABORTED|net::ERR/.test(message.text())) ledger.consoleErrors.push(message.text());
  });
  return { context, page, ledger };
}
const urls = (ledger, pattern) => ledger.requests.filter((r) => pattern.test(r.url));
async function bytes(ledger, pattern) {
  let total = 0;
  for (const [url, size] of ledger.sizes) if (pattern.test(url)) total += size;
  return total;
}
const go = async (page, path = "/") => {
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(2600); // load, then idle (<= 1.5 s), then the clip's first seek
};
const runway = (page) => page.evaluate(() => Math.round(window.innerHeight * 0.6));
/** Scrolls to progress b of the hero's pin and waits for scrub: 1 and the seek to settle. */
async function scrubTo(page, b, wait = 1500) {
  const y = Math.round(b * (await runway(page)));
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(wait);
  return y;
}

const rectOf = `(el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, r: b.right, b: b.bottom }; }`;
async function geometry(page) {
  return page.evaluate(`(() => {
    const rect = ${rectOf};
    const words = [...document.querySelectorAll("[data-hero-word]")].map((w) => { const range = document.createRange(); range.selectNodeContents(w); const b = range.getBoundingClientRect(); return { x: b.x, y: b.y, r: b.right, b: b.bottom, w: b.width, h: b.height }; });
    const stage = document.querySelector("[data-hero-desk]");
    const panel = document.querySelector(".hero-panel");
    const mark = document.querySelector('[data-hero-mark] img');
    const nav = document.querySelector("nav");
    return {
      stage: stage && rect(stage), panel: panel && rect(panel), mark: mark && rect(mark), words,
      panelBg: panel && getComputedStyle(panel).backgroundColor,
      nav: nav ? nav.getBoundingClientRect().bottom : 0,
      stats: [...document.querySelectorAll("[data-hero] ul > li")].map((li) => rect(li)),
      h1: rect(document.querySelector("h1")),
      innerW: innerWidth, innerH: innerHeight, scrollW: document.documentElement.scrollWidth,
    };
  })()`);
}
const intersects = (a, b) => a.x < b.r && a.r > b.x && a.y < b.b && a.b > b.y;
const wordBox = (w) => ({ x: w.x, y: w.y, r: w.r, b: w.b });

// ---------------------------------------------------------------- AC-H1: files and bytes
await section("AC-H1", async () => {
  const size = (path) => (existsSync(path) ? statSync(path).size : -1);
  const ceilings = [
    ["public/media/hero/desk.webm", 2_600_000],
    ["public/media/hero/desk.mp4", 3_000_000],
    ["public/media/hero/desk.poster.webp", 90 * 1024],
    ["public/media/hero/desk.poster-phone.webp", 50 * 1024],
    ["public/media/photos/campus-aerial-720.webp", 60 * 1024],
    ["public/media/photos/campus-aerial-1104.webp", 110 * 1024],
    ["public/media/photos/campus-aerial-1600.webp", 190 * 1024],
  ];
  for (const [path, ceiling] of ceilings) {
    const bytes = size(path);
    check(bytes > 0 && bytes <= ceiling, `AC-H1: ${path} is ${bytes} B, ceiling ${ceiling}`);
  }
  const frames = existsSync("public/media/dragonfly/s384") ? readdirSync("public/media/dragonfly/s384").filter((f) => /^frame-\d\d\.webp$/.test(f)) : [];
  check(frames.length === 16, `AC-H1: ${frames.length} files in s384/, expected 16`);
  let total = 0;
  for (const f of frames) {
    const bytes = size(`public/media/dragonfly/s384/${f}`);
    total += bytes;
    check(bytes <= 10 * 1024, `AC-H1: s384/${f} is ${bytes} B, ceiling 10 KB`);
  }
  check(total <= 150 * 1024, `AC-H1: s384 total ${total} B, ceiling 150 KB`);
  const press = git("ls-files", "public/aau-press").stdout.trim();
  check(press === "", `AC-H1: files under public/aau-press are tracked: ${press}`);
  note(`AC-H1  webm ${kb(size("public/media/hero/desk.webm"))}, mp4 ${kb(size("public/media/hero/desk.mp4"))}, poster ${kb(size("public/media/hero/desk.poster.webp"))}, phone ${kb(size("public/media/hero/desk.poster-phone.webp"))}, s384 ${kb(total)} (16 files)`);
});

// ---------------------------------------------------------------- AC-H2: codecs
await section("AC-H2", async () => {
  const probe = (file, extra = []) => {
    const run = spawnSync("ffprobe", ["-v", "error", "-count_frames", "-show_entries", "stream=codec_type,codec_name,profile,pix_fmt,color_range,nb_read_frames", "-of", "json", ...extra, file], { encoding: "utf8" });
    if (run.error || run.status !== 0) return null;
    return JSON.parse(run.stdout).streams ?? [];
  };
  for (const [file, codec, range] of [["public/media/hero/desk.webm", "vp9", "tv"], ["public/media/hero/desk.mp4", "h264", null]]) {
    const all = probe(file);
    if (!all) {
      skip("AC-H2", `ffprobe is not available (${file})`);
      continue;
    }
    const video = all.filter((s) => s.codec_type === "video");
    check(all.every((s) => s.codec_type === "video"), `AC-H2: ${file} has a stream that is not video (audio?)`);
    check(video[0]?.codec_name === codec, `AC-H2: ${file} codec ${video[0]?.codec_name}, expected ${codec}`);
    check(Number(video[0]?.nb_read_frames) === 72, `AC-H2: ${file} has ${video[0]?.nb_read_frames} frames, expected 72`);
    check(video[0]?.pix_fmt === "yuv420p", `AC-H2: ${file} pix_fmt ${video[0]?.pix_fmt}`);
    if (range) check(video[0]?.color_range === range, `AC-H2: ${file} color_range ${video[0]?.color_range}, expected ${range}`);
    const keys = probe(file, ["-skip_frame", "nokey"]);
    check(Number(keys?.[0]?.nb_read_frames) === 72, `AC-H2: ${file} has ${keys?.[0]?.nb_read_frames} key frames, expected 72 (all-intra)`);
  }
  const mp4 = readFileSync("public/media/hero/desk.mp4");
  const moov = mp4.indexOf("moov");
  const mdat = mp4.indexOf("mdat");
  check(moov > 0 && mdat > 0 && moov < mdat, "AC-H2: desk.mp4 has mdat before moov (no +faststart)");
});

// ---------------------------------------------------------------- AC-H19 and AC-H17 (files)
await section("AC-H19", async () => {
  const text = readFileSync("src/assets/hero-pass/LICENCES.md", "utf8");
  const rows = text.split("\n").filter((l) => l.startsWith("|") && /`[a-z]+\/[^`]+`/.test(l));
  const originals = [];
  for (const dir of ["models", "photos"]) {
    const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
    originals.push(...walk(join("src/assets/hero-pass", dir)));
  }
  for (const file of originals) {
    const rel = relative("src/assets/hero-pass", file).replaceAll("\\", "/");
    const row = rows.find((r) => r.includes("`" + rel + "`") || r.includes("`" + rel + "` "));
    check(Boolean(row), `AC-H19: no LICENCES.md row for ${rel}`);
    if (!row) continue;
    const cells = row.split("|").map((c) => c.trim());
    const hash = (row.match(/`([0-9a-f]{64})`/) ?? [])[1];
    // The gltf files are text: git must not rewrite their line endings (.gitattributes), or this hash drifts.
    check(hash === sha(file), `AC-H19: SHA-256 of ${rel} does not match its row`);
    check(/https?:\/\//.test(row), `AC-H19: ${rel} row has no URL`);
    check(/20\d\d-\d\d-\d\d/.test(row), `AC-H19: ${rel} row has no fetch date`);
    const renderInput = /photos\/(W1|C7|C8|C15|M1)-/.test(rel);
    if (renderInput) check(cells.some((c) => c === "Public domain" || c === "CC0"), `AC-H19: render input ${rel} must be exactly "Public domain" or "CC0" (cells: ${cells.slice(5, 8).join(" ; ")})`);
    if (/C1-Aau_luftbild/.test(rel)) {
      check(row.includes("CC BY-SA 3.0"), "AC-H19: A63's row must say CC BY-SA 3.0");
      check(/web copies stay under CC BY-SA 3\.0/i.test(text), 'AC-H19: LICENCES.md must say "web copies stay under CC BY-SA 3.0"');
    }
  }
  note(`AC-H19 ${originals.length} originals, each with a row and a matching SHA-256`);
});

await section("AC-H17", async () => {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  const dist = walk("dist");
  check(!dist.some((f) => /\.(gltf|glb|bin)$/.test(f)), "AC-H17: a .gltf, .glb or .bin is in dist/");
  check(!dist.some((f) => /hero-pass[\\/](photos|models)|hero-desk[\\/]textures|C1-Aau_luftbild|W1-Woerthersee/.test(f)), "AC-H17: an original or a render texture is in dist/");
  for (const f of dist.filter((f) => /assets[\\/].*\.js$/.test(f))) {
    const js = readFileSync(f, "utf8");
    check(!/WebGLRenderer|three\.module|THREE\./.test(js), `AC-H17: three.js is in ${f}`);
  }
  const src = walk("src").filter((f) => /\.(tsx?|css|html)$/.test(f));
  for (const f of src) {
    const text = readFileSync(f, "utf8");
    check(!/assets\/hero-pass|media-src\//.test(text.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")), `AC-H17: ${f} imports from src/assets/hero-pass or media-src`);
  }
  check(existsSync("media-src/hero-desk/package.json"), "AC-H17: media-src/hero-desk/package.json is missing");
  for (const file of ["package-lock.json", "eslint.config.js"]) {
    check(git("diff", PASS_BASE, "--", file).stdout.trim() === "", `AC-H17: ${file} differs from ${PASS_BASE}`);
  }
  const now = JSON.parse(readFileSync("package.json", "utf8"));
  const before = JSON.parse(git("show", `${PASS_BASE}:package.json`).stdout);
  const { scripts: nowScripts, ...nowRest } = now;
  const { scripts: beforeScripts, ...beforeRest } = before;
  check(JSON.stringify(nowRest) === JSON.stringify(beforeRest), "AC-H17: package.json differs from the pass base outside `scripts`");
  const added = Object.keys(nowScripts).filter((k) => !(k in beforeScripts));
  check(added.join() === "qa:hero", `AC-H17: package.json scripts added: ${added.join()}, expected only qa:hero`);
  const changed = Object.keys(beforeScripts).filter((k) => nowScripts[k] !== beforeScripts[k]);
  check(changed.length === 0, `AC-H17: package.json scripts changed: ${changed.join()}`);
});

await section("AC-H20 (git)", async () => {
  const run = git("diff", "--stat", PASS_BASE, "--", "src/contexts/AuthContext.tsx", "src/components/ProtectedRoute.tsx", "src/pages/Dashboard*.tsx", "src/components/DashboardSidebar.tsx");
  check(run.stdout.trim() === "", `AC-H20: auth or dashboard files changed:\n${run.stdout}`);
});

// ---------------------------------------------------------------- AC-H26 (files; the second build is below)
await section("AC-H26 (files)", async () => {
  const gitignore = readFileSync(".gitignore", "utf8");
  check(/^public\/aau-press\/?$/m.test(gitignore), "AC-H26: .gitignore does not list public/aau-press/");
  const wf = existsSync(".github/workflows") ? readdirSync(".github/workflows").map((f) => readFileSync(join(".github/workflows", f), "utf8")).join("\n") : "";
  check(!/VITE_AAU_PRESS/.test(wf), "AC-H26: a workflow sets VITE_AAU_PRESS");
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
  for (const f of walk("dist")) {
    if (!/\.(js|html|css|json|txt)$/.test(f)) continue;
    const text = readFileSync(f, "utf8");
    check(!/aau-press|Steinthaler|aau\.at/.test(text), `AC-H26: dist/${relative("dist", f)} mentions the press switch, its credit or aau.at`);
  }
});

// ---------------------------------------------------------------- AC-H4: every video plays 1.5 s, in every engine we have
const clipFiles = ["public/media/hero/desk.webm", "public/media/hero/desk.mp4"];
for (const dir of ["banners", "cards"]) for (const f of readdirSync(`public/media/${dir}`).filter((f) => CLIP.test(f))) clipFiles.push(`public/media/${dir}/${f}`);

async function playsIn(engine, label, options = {}) {
  let b;
  try {
    b = await engine.launch(options);
  } catch (error) {
    return { label, launched: false, why: String(error).split("\n")[0] };
  }
  const page = await (await b.newContext()).newPage();
  await page.goto(base + "/robots.txt");
  const results = {};
  for (const file of clipFiles) {
    const url = base + "/" + file.replace(/^public\//, "");
    const type = file.endsWith(".webm") ? 'video/webm; codecs="vp9"' : "video/mp4";
    results[file] = await page.evaluate(
      ({ url, type }) =>
        new Promise((resolve) => {
          const v = document.createElement("video");
          v.muted = true;
          v.playsInline = true;
          v.src = url;
          const claim = v.canPlayType(type);
          if (claim === "") return resolve({ claim: false });
          let error = null;
          v.addEventListener("error", () => (error = v.error?.code ?? "error"));
          document.body.append(v);
          v.play().catch(() => {});
          const start = performance.now();
          const timer = setInterval(() => {
            if (error || v.currentTime >= 1.5 || performance.now() - start > 6000) {
              clearInterval(timer);
              resolve({ claim: true, ok: !error && v.currentTime >= 1.5 && v.error === null, t: +v.currentTime.toFixed(2), error });
            }
          }, 100);
        }),
      { url, type },
    );
  }
  await b.close();
  return { label, launched: true, results };
}
await section("AC-H4", async () => {
  const engines = [
    ["chromium", chromium, {}],
    ["firefox", firefox, {}],
    ["webkit", webkit, {}],
  ];
  if (process.env.QA_CHANNEL) engines.splice(1, 0, [process.env.QA_CHANNEL, chromium, { channel: process.env.QA_CHANNEL }]);
  const passed = new Set();
  const lines = [];
  for (const [label, engine, options] of engines) {
    const run = await playsIn(engine, label, options);
    if (!run.launched) {
      skip("AC-H4", `${label} could not launch (${run.why})`);
      continue;
    }
    let pass = 0;
    let unsupported = 0;
    for (const [file, r] of Object.entries(run.results)) {
      if (!r.claim) {
        unsupported++;
        continue;
      }
      if (r.ok) {
        pass++;
        passed.add(file);
      } else check(false, `AC-H4: ${file} did not play 1.5 s in ${label} (t=${r.t}, error=${r.error})`);
    }
    lines.push(`${label}: ${pass} played, ${unsupported} skipped (codec not claimed)`);
  }
  for (const file of clipFiles) check(passed.has(file), `AC-H4: ${file} played in no browser that claims its type`);
  note(`AC-H4  ${clipFiles.length} files; ${lines.join("; ")}`);
});

// ---------------------------------------------------------------- AC-H3: ground match, in the browser
await section("AC-H3", async () => {
  const page = await (await browser.newContext()).newPage();
  await page.goto(base + "/robots.txt");
  const target = [0xf6, 0xf6, 0xf3];
  const sample = async (kind, url) =>
    page.evaluate(
      async ({ kind, url }) => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 960;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (kind === "image") {
          const img = new Image();
          img.src = url;
          await img.decode();
          ctx.drawImage(img, 0, 0, 960, 960);
        } else {
          const v = document.createElement("video");
          v.muted = true;
          v.src = url;
          if (v.canPlayType(url.endsWith(".webm") ? 'video/webm; codecs="vp9"' : "video/mp4") === "") return null;
          await new Promise((resolve, reject) => {
            v.addEventListener("loadeddata", resolve, { once: true });
            v.addEventListener("error", () => reject(new Error("error " + v.error?.code)), { once: true });
          });
          v.currentTime = 0.5 / 30;
          await new Promise((r) => v.addEventListener("seeked", r, { once: true }));
          ctx.drawImage(v, 0, 0, 960, 960);
        }
        const out = [];
        for (const [x, y] of [[0, 0], [928, 0], [0, 928], [928, 928]]) {
          const d = ctx.getImageData(x, y, 32, 32).data;
          const s = [0, 0, 0];
          for (let i = 0; i < d.length; i += 4) for (let c = 0; c < 3; c++) s[c] += d[i + c];
          out.push(s.map((v) => v / 1024));
        }
        return out;
      },
      { kind, url },
    );
  const lines = [];
  for (const [kind, name] of [["image", "hero/desk.poster.webp"], ["video", "hero/desk.webm"], ["video", "hero/desk.mp4"]]) {
    const patches = await sample(kind, `${base}/media/${name}`).catch((error) => ({ error: String(error) }));
    if (patches === null) {
      skip("AC-H3", `${name}: this browser does not play it`);
      continue;
    }
    if (patches.error) {
      check(false, `AC-H3: ${name}: ${patches.error}`);
      continue;
    }
    const worst = Math.max(...patches.flatMap((p) => p.map((v, c) => Math.abs(v - target[c]))));
    check(worst <= 3, `AC-H3: ${name} corner patch is ${worst.toFixed(1)} from #f6f6f3, limit 3`);
    lines.push(`${name} ${worst.toFixed(1)}`);
  }
  note(`AC-H3  worst corner deviation from #f6f6f3: ${lines.join(", ")}`);
});

// ---------------------------------------------------------------- AC-H9 and AC-H10: first paint and bytes
await section("AC-H9/H10", async () => {
  for (const [name, options] of [["390", { ...phoneCtx, net4g: true }], ["1440", { net4g: true }]]) {
    const { context, page, ledger } = await open(options);
    await page.goto(base + "/", { waitUntil: "load" });
    const before = ledger.requests.filter((r) => r.beforeLoad);
    check(!before.some((r) => CLIP.test(r.url)), `AC-H9 ${name}: a .webm or .mp4 was requested before load`);
    const expected = name === "390" ? ["/media/hero/desk.poster-phone.webp", "/media/dragonfly/s384/frame-00.webp"] : ["/media/hero/desk.poster.webp", "/media/dragonfly/s384/frame-00.webp"];
    const early = before.filter((r) => /\/media\/(hero|dragonfly)\//.test(r.url)).map((r) => new URL(r.url).pathname);
    check(early.every((p) => expected.includes(p)), `AC-H9 ${name}: before load the hero requested ${early.join(", ")}; allowed ${expected.join(", ")}`);
    // The route chunk is lazy, so the poster can start just after `load`; either way it starts before any clip or extra frame.
    await page.waitForTimeout(700);
    const firstWindow = ledger.requests.filter((r) => /\/media\/(hero|dragonfly)\//.test(r.url));
    const order = firstWindow.map((r) => new URL(r.url).pathname);
    const posterAt = order.indexOf(expected[0]);
    const firstClip = order.findIndex((p) => CLIP.test(p));
    check(posterAt >= 0 && (firstClip < 0 || posterAt < firstClip), `AC-H9 ${name}: the poster is not requested before the clip (${order.slice(0, 4).join(", ")})`);
    check(order.includes(expected[1]), `AC-H9 ${name}: frame-00 was not requested`);
    check(!(await page.evaluate(() => [...document.querySelectorAll('link[rel="preload"]')].some((l) => /media/.test(l.href)))), `AC-H9 ${name}: a <link rel=preload> names media`);
    await page.waitForTimeout(6000);
    const heroBefore = await bytes(ledger, /\/media\/(hero|dragonfly)\//);
    const limitBefore = name === "390" ? 60 * 1024 : 100 * 1024;
    if (name === "390") check(heroBefore <= limitBefore + 2048, `AC-H10 390: hero bytes ${kb(heroBefore)} exceed ${kb(limitBefore)}`);
    // scroll through the pin and on to the Why section
    if (name === "1440") await scrubTo(page, 1, 800);
    await page.evaluate(() => document.querySelector("[data-why-photo]")?.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(2500);
    const heroAfter = await bytes(ledger, /\/media\/(hero|dragonfly)\//);
    const photo = await bytes(ledger, /\/media\/photos\//);
    if (name === "390") {
      check(heroAfter + photo <= 125 * 1024, `AC-H10 390: hero + photo ${kb(heroAfter + photo)} exceed 125 KB (60 + 60)`);
      check(heroAfter <= 62 * 1024, `AC-H10 390: hero bytes after scroll ${kb(heroAfter)} exceed 62 KB`);
    } else {
      const ceiling = 100 * 1024 + 2_740_000 + 190 * 1024;
      check(heroAfter + photo <= ceiling, `AC-H10 1440: hero + photo ${kb(heroAfter + photo)} exceed ${kb(ceiling)}`);
      check(await bytes(ledger, /desk\.webm|desk\.mp4/) <= 3_000_000 * 2, "AC-H10 1440: clip bytes over the worst case");
    }
    const per = [...ledger.sizes].filter(([u]) => /\/media\/(hero|dragonfly|photos)\//.test(u)).map(([u, n]) => `${new URL(u).pathname.split("/").pop()} ${kb(n)}`);
    note(`AC-H10 ${name}: hero ${kb(heroAfter)} (at 6 s ${kb(heroBefore)}), photo ${kb(photo)}; ${per.length > 8 ? per.slice(0, 5).join(", ") + ", ..." : per.join(", ")}`);
    await context.close();
  }
});

// ---------------------------------------------------------------- AC-H8: the poster-only states
await section("AC-H8", async () => {
  const states = [
    ["reduced motion", { reducedMotion: "reduce" }, null],
    ["saveData", {}, "Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g', addEventListener() {}, removeEventListener() {} }, configurable: true });"],
    ["effectiveType 3g", {}, "Object.defineProperty(navigator, 'connection', { value: { saveData: false, effectiveType: '3g', addEventListener() {}, removeEventListener() {} }, configurable: true });"],
    ["still (c4s.ledger.still=1)", {}, "try { localStorage.setItem('c4s.ledger.still', '1'); } catch (e) {}"],
    ["coarse pointer at 1440", { isMobile: true, hasTouch: true }, null],
    ["1279 x 800", { viewport: { width: 1279, height: 800 } }, null],
    ["1440 x 630", { viewport: { width: 1440, height: 630 } }, null],
  ];
  for (const [name, options, init] of states) {
    const { context, page, ledger } = await open(options, init);
    await go(page);
    await scrubTo(page, 1, 500);
    const state = await page.evaluate(() => ({
      video: document.querySelectorAll("[data-hero-desk] video").length,
      pinned: Boolean(document.querySelector("[data-hero]")?.parentElement?.classList.contains("pin-spacer")),
      poster: [...document.querySelectorAll("[data-hero-desk] img")].some((i) => i.complete && i.naturalWidth > 0 && !i.closest("[data-hero-mark]")),
      desk: document.querySelector("[data-hero-desk]")?.dataset.desk,
    }));
    check(state.video === 0, `AC-H8 ${name}: a <video> exists`);
    check(!state.pinned, `AC-H8 ${name}: the hero is pinned`);
    check(state.poster, `AC-H8 ${name}: the poster is not in the page`);
    check(urls(ledger, /\/media\/hero\/.*\.(webm|mp4)/).length === 0, `AC-H8 ${name}: a hero clip was requested`);
    const extra = urls(ledger, FRAME_N).filter((r) => Number(r.url.match(FRAME_N)[1]) > 0);
    check(extra.length === 0, `AC-H8 ${name}: frames 01-15 were requested (${extra.length})`);
    check(ledger.pageErrors.length === 0, `AC-H8 ${name}: page errors ${ledger.pageErrors.join(" | ")}`);
    await context.close();
  }
  note(`AC-H8  poster-only in ${states.length} states: no video, no clip request, no frames 01-15, no pin spacer`);
});

// ---------------------------------------------------------------- AC-H11 geometry, AC-H12 pin, AC-H13 scrub, AC-H14 dragonfly
const viewports = [[1280, 720], [1366, 650], [1440, 900], [1536, 730], [1920, 1080], [2560, 1440]];
await section("AC-H11", async () => {
  const heroData = await import("node:fs").then((fs) => fs.readFileSync("src/data/heroDesk.ts", "utf8"));
  const last = { u: Number(heroData.match(/last: \{ u: ([\d.]+)/)[1]), v: Number(heroData.match(/last: \{ u: [\d.]+, v: ([\d.]+)/)[1]) };
  for (const [w, h] of viewports) {
    const { context, page, ledger } = await open({ viewport: { width: w, height: h } });
    await go(page);
    const name = `${w}x${h}`;
    let g = await geometry(page);
    const widest = Math.max(...g.words.map((x) => x.r));
    check(g.stage.x >= widest + 24 - 1, `AC-H11 ${name}: box left ${g.stage.x.toFixed(1)} < widest word right ${widest.toFixed(1)} + 24`);
    check(/^rgb\(/.test(g.panelBg), `AC-H11 ${name}: the panel is not opaque (${g.panelBg})`);
    check(g.panel.x >= g.stage.x - 1 && g.panel.r <= g.stage.r + 1 && g.panel.y >= g.stage.y - 1 && g.panel.b <= g.stage.b + 1, `AC-H11 ${name}: the panel is not inside the box`);
    check(g.stats.every((s) => s.b <= h + 0.5), `AC-H11 ${name}: a stat cell ends below the viewport bottom at b=0`);
    for (const b of [0, 0.25, 0.5, 0.75, 0.85, 1]) {
      await scrubTo(page, b, 1700);
      g = await geometry(page);
      const m = g.mark;
      const where = `${name} b=${b}`;
      check(!intersects(m, g.panel), `AC-H11 ${where}: the dragonfly meets the panel`);
      check(!g.words.some((x) => intersects(m, wordBox(x))), `AC-H11 ${where}: the dragonfly meets a word`);
      check(m.x >= g.stage.x + 8 && m.r <= g.stage.r - 8 && m.y >= g.stage.y + 8 && m.b <= g.stage.b - 8, `AC-H11 ${where}: the dragonfly is within 8 px of the box edge (${JSON.stringify({ m, stage: g.stage }).slice(0, 160)})`);
      check(m.y >= g.nav + 8, `AC-H11 ${where}: the dragonfly's top ${m.y.toFixed(1)} is under the nav (${g.nav})`);
      if (b === 1) {
        const cover = Math.max(g.stage.w, g.stage.h);
        const cx = g.stage.x + (g.stage.w - cover) / 2 + last.u * cover;
        const cy = g.stage.y + (g.stage.h - cover) / 2 + last.v * cover;
        const dx = m.x + m.w / 2 - cx;
        const dy = m.y + m.h / 2 - cy;
        check(Math.hypot(dx, dy) <= 4, `AC-H11 ${name} b=1: the dragonfly's centre is ${Math.hypot(dx, dy).toFixed(1)} px from landing.last (limit 4)`);
      }
    }
    check(ledger.pageErrors.length === 0, `AC-H11 ${name}: page errors ${ledger.pageErrors.join(" | ")}`);
    await context.close();
  }
  // once with the web fonts blocked: the fallback's metrics are what the 4.2 em rule has to cover
  const { context, page } = await open({ viewport: { width: 1440, height: 900 } });
  await page.route("**/fonts/**", (route) => route.abort());
  await go(page);
  const g = await geometry(page);
  check(g.stage.x >= Math.max(...g.words.map((x) => x.r)) + 24 - 1, "AC-H11 fonts blocked: the box overlaps the words");
  await context.close();
  note(`AC-H11 geometry held at ${viewports.map(([w, h]) => `${w}x${h}`).join(", ")} for b = 0, .25, .5, .75, .85, 1`);
});

await section("AC-H12/H13/H14", async () => {
  const { context, page, ledger } = await open({ viewport: { width: 1440, height: 900 } });
  await go(page);
  const nav = await page.evaluate(() => document.querySelector("nav").getBoundingClientRect().bottom);
  // pin
  const top = async () => page.evaluate(() => document.querySelector("[data-hero]").getBoundingClientRect().top);
  for (const f of [0, 0.25, 0.5, 0.9]) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(f * 0.6 * 900));
    await page.waitForTimeout(500);
    const t = await top();
    check(Math.abs(t - nav) <= 1.5, `AC-H12: the hero top is ${t.toFixed(1)} at ${f} of the runway, expected ${nav}`);
  }
  await page.evaluate(() => window.scrollTo(0, 540 + 300));
  await page.waitForTimeout(800);
  check((await top()) < nav - 100, "AC-H12: the hero does not move after the runway");
  // the Ledger's pin still pins at the top, with the hero's spacing included
  const ledgerPin = await page.evaluate(() => {
    const section = document.querySelector("#ledger");
    const spacer = section?.parentElement;
    if (!spacer?.classList.contains("pin-spacer")) return null;
    window.scrollTo(0, spacer.getBoundingClientRect().top + window.scrollY + 60);
    return new Promise((resolve) => setTimeout(() => resolve(Math.round(section.getBoundingClientRect().top)), 1500));
  });
  check(ledgerPin !== null && Math.abs(ledgerPin) <= 2, `AC-H12: the Ledger is not pinned at the top after the hero's spacing (top ${ledgerPin})`);
  // scrub
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const state = () => page.evaluate(() => { const v = document.querySelector("[data-hero-desk] video"); return v && { t: v.currentTime, paused: v.paused, src: v.currentSrc }; });
  const first = await state();
  check(Boolean(first), "AC-H13: no <video> after load and idle at 1440 inside the guard");
  let lastT = -1;
  let pausedAlways = true;
  let decreased = false;
  for (let i = 0; i <= 20; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((i / 20) * 0.6 * 900));
    await page.waitForTimeout(250);
    const s = await state();
    if (!s) continue;
    pausedAlways &&= s.paused;
    if (s.t < lastT - 1e-6) decreased = true;
    lastT = s.t;
  }
  await page.waitForTimeout(1500);
  const end = await state();
  check(pausedAlways && end?.paused, "AC-H13: the video was not paused throughout");
  check(!decreased, "AC-H13: the frame decreased while scrolling down");
  check(end && Math.abs(end.t - 71.5 / 30) <= 1 / 30 + 1e-3, `AC-H13: currentTime at b=1 is ${end?.t}, expected ${(71.5 / 30).toFixed(3)} +- 1/30`);
  check(end?.src.endsWith("desk.webm") || end?.src.endsWith("desk.mp4"), `AC-H13: unexpected source ${end?.src}`);
  // a hidden hero issues no seeks
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(1500);
  const hidden = await state();
  await page.evaluate(() => window.scrollTo(0, 2600));
  await page.waitForTimeout(800);
  check(Math.abs((await state()).t - hidden.t) < 1e-6, "AC-H13: a seek was issued while the hero is off-screen");
  // frame time over a 2 s wheel scrub
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const fps = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const deltas = [];
        let last = performance.now();
        const start = last;
        const tick = (now) => {
          deltas.push(now - last);
          last = now;
          window.scrollTo(0, Math.min(540, ((now - start) / 2000) * 540));
          if (now - start < 2000) requestAnimationFrame(tick);
          else {
            deltas.sort((a, b) => a - b);
            resolve({ mean: 1000 / (deltas.reduce((a, b) => a + b, 0) / deltas.length), p95: deltas[Math.floor(deltas.length * 0.95)] });
          }
        };
        requestAnimationFrame(tick);
      }),
  );
  note(`AC-H13 scrub: video.paused throughout; b=1 currentTime ${end?.t.toFixed(3)}; ${fps.mean.toFixed(0)} fps mean, p95 frame ${fps.p95.toFixed(1)} ms (headless: indicative only)`);
  if (fps.mean < 50) note(`AC-H13 NOTE: ${fps.mean.toFixed(0)} fps in this headless run is below 50; reported as indicative`);
  // dragonfly
  const imgs = await page.evaluate((alt) => document.querySelectorAll(`img[alt="${alt}"]`).length, ALT);
  check(imgs === 1, `AC-H14: ${imgs} img[alt="${ALT}"], expected exactly 1`);
  check(await page.evaluate(() => document.querySelector("[data-dragonfly-canvas]")?.getAttribute("aria-hidden") === "true"), "AC-H14: the canvas is not aria-hidden");
  const canvasHash = (b) =>
    page.evaluate(async (b) => {
      window.scrollTo(0, Math.round(b * 0.6 * innerHeight));
      await new Promise((r) => setTimeout(r, 1700));
      const c = document.querySelector("[data-dragonfly-canvas]");
      return { opacity: getComputedStyle(c).opacity, data: c.toDataURL("image/png") };
    }, b);
  const c0 = await canvasHash(0);
  const c85 = await canvasHash(0.85);
  const c1 = await canvasHash(1);
  check(c0.opacity === "1", "AC-H14: the canvas is not shown after the frames loaded");
  check(c0.data !== c85.data, "AC-H14: the canvas at b=0.85 equals frame 00 (no bank frames drawn)");
  check(c0.data === c1.data, "AC-H14: the canvas at b=1 is not frame 00 again");
  check(ledger.pageErrors.length === 0 && ledger.consoleErrors.length === 0, `AC-H12-14: errors ${[...ledger.pageErrors, ...ledger.consoleErrors].join(" | ")}`);
  await context.close();
  // reduced motion: at landing.first with no transform
  const rm = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await go(rm.page);
  const t = await rm.page.evaluate(() => ({ mark: getComputedStyle(document.querySelector("[data-hero-mark]")).transform, pos: getComputedStyle(document.querySelector("[data-hero-pos]")).transform }));
  check(t.mark === "none" && (t.pos === "none" || t.pos === "matrix(1, 0, 0, 1, 0, 0)"), `AC-H14 reduced motion: transforms ${t.mark} / ${t.pos}`);
  await rm.context.close();
});

// ---------------------------------------------------------------- AC-H5, H6, H7: the ladder (needs H.264, so Chrome)
async function ladderPage(route) {
  const { context, page, ledger } = await open({ viewport: { width: 1440, height: 900 } });
  if (route) await route(page);
  await go(page);
  return { context, page, ledger };
}
const mp4Claimed = async () => {
  const page = await (await browser.newContext()).newPage();
  await page.goto(base + "/robots.txt");
  const claim = await page.evaluate(() => document.createElement("video").canPlayType("video/mp4"));
  await page.close();
  return claim !== "";
};
await section("AC-H5/H6/H7", async () => {
  if (!(await mp4Claimed())) {
    skip("AC-H5", `this browser cannot play H.264 (${channel}); run with QA_CHANNEL=chrome`);
    skip("AC-H6", "needs H.264, as AC-H5");
    skip("AC-H7", "needs H.264, as AC-H5");
    return;
  }
  const state = (page) => page.evaluate(() => { const v = document.querySelector("[data-hero-desk] video"); return { src: v?.currentSrc ?? null, t: v?.currentTime ?? null, desk: document.querySelector("[data-hero-desk]").dataset.desk, video: Boolean(v) }; });
  // H5: WebM blocked
  {
    const { context, page, ledger } = await ladderPage((p) => p.route("**/media/hero/desk.webm", (r) => r.abort()));
    await scrubTo(page, 0.5, 2500);
    const s = await state(page);
    check(s.src?.endsWith("desk.mp4"), `AC-H5: currentSrc is ${s.src}, expected desk.mp4`);
    check(s.desk === "video", `AC-H5: data-desk is ${s.desk}`);
    check(Math.abs(s.t - (Math.round(0.5 * 71) + 0.5) / 30) <= 1 / 30 + 0.01, `AC-H5: currentTime ${s.t} is not within 1/30 of the target ${(36.5 / 30).toFixed(3)}`);
    check(ledger.pageErrors.length === 0, `AC-H5: page errors ${ledger.pageErrors.join(" | ")}`);
    await context.close();
  }
  // H6: WebM answered with its first 25 %, then random bytes
  const real = readFileSync("public/media/hero/desk.webm");
  const broken = Buffer.concat([real.subarray(0, Math.floor(real.length * 0.25)), Buffer.from(Array.from({ length: Math.floor(real.length * 0.75) }, () => Math.floor(Math.random() * 256)))]);
  {
    const { context, page } = await ladderPage((p) => p.route("**/media/hero/desk.webm", (r) => r.fulfill({ status: 200, contentType: "video/webm", body: broken })));
    await scrubTo(page, 0.5, 4500);
    const s = await state(page);
    check(s.src?.endsWith("desk.mp4"), `AC-H6: after a decode failure currentSrc is ${s.src}, expected desk.mp4 within 2 s of the seek`);
    await context.close();
  }
  {
    const { context, page } = await ladderPage(async (p) => {
      await p.route("**/media/hero/desk.webm", (r) => r.fulfill({ status: 200, contentType: "video/webm", body: broken }));
      await p.route("**/media/hero/desk.mp4", (r) => r.fulfill({ status: 200, contentType: "video/mp4", body: Buffer.from(Array.from({ length: 4096 }, () => Math.floor(Math.random() * 256))) }));
    });
    await scrubTo(page, 0.5, 5500);
    const s = await state(page);
    check(!s.video && s.desk === "poster", `AC-H6: with both sources broken the video should be gone and data-desk="poster" (video ${s.video}, desk ${s.desk})`);
    await scrubTo(page, 1, 1800);
    const g = await geometry(page);
    check(g.mark.y > g.nav, "AC-H6: the dragonfly is not on screen after both sources failed");
    await context.close();
  }
  // H7: range requests after the first are delayed 4 s
  {
    let later = 0;
    const { context, page } = await ladderPage((p) =>
      p.route("**/media/hero/desk.webm", async (r) => {
        if (later++ > 0) await sleep(4000);
        await r.continue();
      }),
    );
    await scrubTo(page, 0.6, 5000);
    const s = await state(page);
    if (later < 2) skip("AC-H7", "the browser made one request for desk.webm, so no seek stalled (not exercised)");
    else check(s.src?.endsWith("desk.mp4"), `AC-H7: after a stalled seek currentSrc is ${s.src}, expected desk.mp4`);
    await context.close();
  }
  note("AC-H5/H6: WebM blocked and WebM corrupted both fall to desk.mp4; both broken falls to the poster");
});

// ---------------------------------------------------------------- AC-H15: phones
await section("AC-H15", async () => {
  for (const [w, h] of [[390, 844], [360, 800], [320, 568]]) {
    const { context, page, ledger } = await open({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
    await go(page);
    const name = `${w}x${h}`;
    check(urls(ledger, CLIP).length === 0, `AC-H15 ${name}: a clip was requested`);
    check(!urls(ledger, /HomeMotion|gsap/i).length, `AC-H15 ${name}: the GSAP chunk was requested`);
    const heroImgs = urls(ledger, /\/media\/(hero|dragonfly)\//).map((r) => new URL(r.url).pathname).sort();
    check(JSON.stringify(heroImgs) === JSON.stringify(["/media/dragonfly/s384/frame-00.webp", "/media/hero/desk.poster-phone.webp"]), `AC-H15 ${name}: hero images ${heroImgs.join(", ")}`);
    const g = await geometry(page);
    check(g.mark && !g.words.some((x) => intersects(g.mark, wordBox(x))), `AC-H15 ${name}: the dragonfly meets a word`);
    check(!g.words.some((x) => intersects({ x: g.stage.x, y: g.stage.y, r: g.stage.r, b: g.stage.b }, wordBox(x))), `AC-H15 ${name}: the strip meets a word`);
    check(g.scrollW <= g.innerW, `AC-H15 ${name}: horizontal overflow ${g.scrollW - g.innerW}px`);
    check(g.mark.x >= -1 && g.mark.r <= w + 1, `AC-H15 ${name}: the dragonfly leaves the strip sideways`);
    if (w === 390) {
      const tab = await page.evaluate(() => document.querySelector("[data-tabbar]")?.getBoundingClientRect().top ?? 9999);
      check(g.stats[0].y < tab, `AC-H15 ${name}: the first stat row's top ${g.stats[0].y.toFixed(0)} is not above the tab bar (${tab.toFixed(0)})`);
    }
    check(ledger.pageErrors.length === 0, `AC-H15 ${name}: page errors`);
    await context.close();
  }
  note("AC-H15 phones at 390, 360 and 320: poster, no clip, no GSAP chunk, no overflow");
});

// ---------------------------------------------------------------- AC-H16: zero media
await section("AC-H16", async () => {
  for (const mode of ["abort", "html200"]) {
    for (const [w, h, options] of [[1440, 900, {}], [390, 844, phoneCtx]]) {
      const { context, page, ledger } = await open({ viewport: { width: w, height: h }, ...options });
      const html = readFileSync("dist/index.html");
      await page.route(/\/media\/(hero|dragonfly|photos)\//, (route) => (mode === "abort" ? route.abort() : route.fulfill({ status: 200, contentType: "text/html", body: html })));
      await go(page);
      await page.evaluate(() => document.querySelector("[data-why-photo]")?.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(1500);
      const name = `${mode} ${w}`;
      const s = await page.evaluate(() => {
        const rect = (el) => el.getBoundingClientRect();
        const stage = document.querySelector("[data-hero-desk]");
        const broken = [...document.images].filter((i) => i.getBoundingClientRect().width > 0 && (!i.complete || i.naturalWidth === 0) && i.currentSrc);
        return {
          media: stage?.dataset.media,
          stageShown: stage ? getComputedStyle(stage).display !== "none" : false,
          broken: broken.map((i) => i.currentSrc),
          lineArt: [...document.querySelectorAll("[data-hero] svg")].some((svg) => svg.getBoundingClientRect().width > 50),
          figure: document.querySelectorAll("[data-why-photo]").length,
          caption: document.body.textContent.includes("Uniklupresse"),
          h1: rect(document.querySelector("h1")).bottom <= innerHeight,
          lead: [...document.querySelectorAll("[data-hero] p")].some((p) => /Your complete platform/.test(p.textContent) && rect(p).top < innerHeight),
          cta: [...document.querySelectorAll("[data-hero] a")].filter((a) => /Explore Bonuses|How It Works/.test(a.textContent)).length === 2,
          stat: rect(document.querySelector("[data-hero] ul > li")).top < innerHeight,
        };
      });
      check(s.media === "failed" && !s.stageShown, `AC-H16 ${name}: data-media is ${s.media}, stage shown ${s.stageShown}`);
      check(s.broken.length === 0, `AC-H16 ${name}: broken-image boxes: ${s.broken.join(", ")}`);
      if (w >= 768) check(s.lineArt, `AC-H16 ${name}: the line art is not in the right column`);
      else check(!s.lineArt, `AC-H16 ${name}: line art on a phone`);
      check(s.figure === 0 || (await page.locator("[data-why-photo]").count()) === 0, `AC-H16 ${name}: the Why figure is still there`);
      check(!s.caption, `AC-H16 ${name}: a caption is left behind without its photo`);
      check(s.h1 && s.lead && s.cta && s.stat, `AC-H16 ${name}: h1, lead, CTAs or stats are not in view (${JSON.stringify(s)})`);
      check(ledger.pageErrors.length === 0, `AC-H16 ${name}: page errors ${ledger.pageErrors.join(" | ")}`);
      await context.close();
    }
  }
  note("AC-H16 with hero, dragonfly and photo files aborted, and answered with index.html at 200: finished page, no broken boxes, no orphan caption");
});

// ---------------------------------------------------------------- AC-H21: lifecycle
await section("AC-H21", async () => {
  const { context, page } = await open({ viewport: { width: 1440, height: 900 } });
  await go(page);
  const videos = () => page.evaluate(() => document.querySelectorAll("video[aria-hidden='true']").length);
  const heroVideos = () => page.evaluate(() => document.querySelectorAll("[data-hero-desk] video").length);
  check((await heroVideos()) === 1, "AC-H21: no video at the start");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("link", { name: /^Housing$/ }).first().click();
    await page.waitForTimeout(900);
    await page.getByRole("link", { name: /^Home$/ }).first().click();
    await page.waitForTimeout(3000);
    check((await heroVideos()) <= 1, `AC-H21: ${await heroVideos()} hero videos after round trip ${i + 1}`);
  }
  check((await videos()) <= 2, "AC-H21: videos accumulate across navigation");
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.waitForTimeout(1500);
  check((await heroVideos()) === 0, "AC-H21: the video survives a resize to 1100");
  check(!(await page.evaluate(() => Boolean(document.querySelector("[data-hero]")?.parentElement?.classList.contains("pin-spacer")))), "AC-H21: the hero's pin spacer survives a resize to 1100");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(3500);
  check((await heroVideos()) === 1, "AC-H21: the video does not come back at 1440");
  check(await page.evaluate(() => Boolean(document.querySelector("[data-hero]")?.parentElement?.classList.contains("pin-spacer"))), "AC-H21: the hero's pin does not come back at 1440");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  check((await heroVideos()) === 0, "AC-H21: reduced motion mid-visit does not remove the video");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(3500);
  await page.emulateMedia({ media: "print" });
  const display = await page.evaluate(() => { const v = document.querySelector("[data-hero-desk] video"); return v ? getComputedStyle(v).display : "none"; });
  check(display === "none", `AC-H21: in print the video is ${display}`);
  await context.close();
});

// ---------------------------------------------------------------- AC-H24, H25, H28: the framed photo
await section("AC-H24/H25/H28", async () => {
  const cases = [[1440, 900, 552, 368], [1280, 720, 490, 327], [1024, 768, 553, 369], [768, 1024, 413, 275], [390, 844, 358, 239], [360, 800, 328, 219]];
  for (const [w, h, ew, eh] of cases) {
    for (const dpr of w === 1440 || w === 390 ? [1, 2] : [1]) {
      const { context, page, ledger } = await open({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, net4g: true, ...(w < 768 ? { isMobile: true, hasTouch: true } : {}) });
      await page.goto(base + "/", { waitUntil: "load" });
      await page.waitForSelector("[data-why-photo]");
      await page.waitForTimeout(2200);
      check(urls(ledger, /campus-aerial/).length === 0, `AC-H25 ${w}@${dpr}: a campus-aerial file was requested before the first scroll`);
      await page.evaluate(() => document.querySelector("[data-why-photo]").scrollIntoView({ block: "center" }));
      await page.waitForTimeout(2200);
      const s = await page.evaluate(() => {
        const fig = document.querySelector("[data-why-photo]");
        const img = fig.querySelector("img");
        const cap = fig.querySelector("figcaption");
        const list = document.querySelector("[data-why-row]");
        const links = [...cap.querySelectorAll("a")];
        const ir = img.getBoundingClientRect();
        const cr = cap.getBoundingClientRect();
        const lr = list.getBoundingClientRect();
        const cs = getComputedStyle(cap);
        const probe = links[0];
        probe.focus({ preventScroll: true });
        const ring = getComputedStyle(probe).outlineStyle;
        const section = document.querySelector("[data-why-photo]").closest("section");
        return {
          w: ir.width, h: ir.height, x: ir.x, r: ir.right, top: ir.top, listTop: lr.top, loading: img.loading, lazy: img.getAttribute("loading"),
          currentSrc: img.currentSrc, natural: img.naturalWidth, dpr: devicePixelRatio, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          text: cap.textContent.replace(/\\s+/g, " ").trim(), links: links.map((a) => a.href), capVisible: cr.width > 0 && cr.height > 0 && cs.display !== "none" && cs.visibility !== "hidden" && !cap.closest(".sr-only"),
          color: cs.color, ring, contentX: section.querySelector(".shell-x").getBoundingClientRect().x, contentW: section.querySelector(".shell-x").getBoundingClientRect().width,
          alt: img.alt, capBottom: cr.bottom,
        };
      });
      const id = `${w}@${dpr}`;
      check(Math.abs(s.w - ew) <= 2 && Math.abs(s.h - eh) <= 2, `AC-H24 ${id}: figure is ${s.w.toFixed(0)}x${s.h.toFixed(0)}, expected ${ew}x${eh}`);
      check(Math.abs(s.w / s.h - 1.5) <= 0.01, `AC-H24 ${id}: ratio ${(s.w / s.h).toFixed(3)}`);
      if (w >= 1280) check(Math.abs(s.top - s.listTop) <= 1, `AC-H24 ${id}: the figure's top ${s.top.toFixed(1)} is not on the list's top rule ${s.listTop.toFixed(1)}`);
      check(s.overflow <= 0, `AC-H24 ${id}: horizontal overflow`);
      check(s.lazy === "lazy", `AC-H25 ${id}: not lazy`);
      const picked = Number((s.currentSrc.match(/aerial-(\d+)/) ?? [])[1]);
      check(picked >= Math.round(s.w * dpr) - 1 || picked === 1600, `AC-H25 ${id}: currentSrc ${s.currentSrc} is too small for ${s.w.toFixed(0)} CSS px x ${dpr}`);
      check(s.text === "Photo: “Aau luftbild” by Uniklupresse, CC BY-SA 3.0, via Wikimedia Commons", `AC-H28 ${id}: credit text is "${s.text}"`);
      check(s.links.length === 2 && /File:Aau_luftbild\.jpg/.test(s.links[0]) && /creativecommons\.org\/licenses\/by-sa\/3\.0/.test(s.links[1]), `AC-H28 ${id}: links ${s.links.join(", ")}`);
      check(s.capVisible, `AC-H28 ${id}: the credit is not visible`);
      check(s.ring !== "none", `AC-H28 ${id}: no focus ring on the credit link`);
      check(s.alt === "Aerial view of the university campus in Klagenfurt, by the Wörthersee", `AC-H24 ${id}: alt is "${s.alt}"`);
      if ((w === 1440 || w === 390) && (dpr === 1 || dpr === 2)) note(`AC-H25 ${id}: ${s.currentSrc.replace(base, "")} for ${s.w.toFixed(0)} CSS px`);
      await context.close();
    }
  }
  // layout shift of the reserved box
  const { context, page } = await open({ viewport: { width: 1440, height: 900 } }, "window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });");
  await page.goto(base + "/", { waitUntil: "load" });
  await page.waitForSelector("[data-why-photo]");
  await page.evaluate(() => document.querySelector("[data-why-photo]").scrollIntoView({ block: "center" }));
  await page.waitForTimeout(2500);
  const cls = await page.evaluate(() => window.__cls);
  check(cls <= 0.02, `AC-H24: layout shift while the figure loads is ${cls.toFixed(4)}`);
  await context.close();
});

// ---------------------------------------------------------------- CLS and LCP of the hero, at both widths
await section("CLS/LCP", async () => {
  const init = `window.__cls = 0; window.__lcp = null;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { const e = l.getEntries().pop(); window.__lcp = { t: e.startTime, tag: e.element && e.element.tagName, url: e.url }; }).observe({ type: 'largest-contentful-paint', buffered: true });`;
  for (const [name, options] of [["390", phoneCtx], ["1440", {}]]) {
    const { context, page } = await open(options, init);
    await page.goto(base + "/", { waitUntil: "load" });
    await page.waitForTimeout(4500);
    await scrubTo(page, 1, 1000).catch(() => {});
    const m = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp, clipStart: (performance.getEntriesByType("resource").find((r) => /desk\.(webm|mp4)/.test(r.name)) ?? {}).startTime ?? null }));
    if (name === "1440") check(m.clipStart !== null && m.clipStart > (m.lcp?.t ?? Infinity), `LCP ${name}: the clip starts at ${m.clipStart?.toFixed?.(0)} ms, before the LCP at ${m.lcp?.t.toFixed(0)} ms`);
    if (name === "390") check(m.clipStart === null, "LCP 390: a clip was requested on a phone");
    check(m.cls <= 0.05, `CLS ${name}: ${m.cls.toFixed(4)} exceeds 0.05`);
    check(m.lcp && m.lcp.tag !== "VIDEO", `LCP ${name}: the LCP element is a <video>`);
    check(m.lcp && m.lcp.t <= 2500, `LCP ${name}: ${m.lcp?.t.toFixed(0)} ms exceeds 2500 (unthrottled)`);
    note(`CLS ${name}: ${m.cls.toFixed(4)}; LCP ${m.lcp?.t.toFixed(0)} ms on <${m.lcp?.tag}> ${m.lcp?.url?.replace(base, "") ?? ""} (unthrottled; the throttled run is qa:media's)`);
    await context.close();
  }
});

// ---------------------------------------------------------------- AC-H20 (DOM): frozen copy
await section("AC-H20 (DOM)", async () => {
  const { context, page } = await open();
  await go(page);
  const s = await page.evaluate(() => ({
    words: [...document.querySelectorAll("[data-hero-word]")].map((w) => w.textContent),
    h1: document.querySelector("h1").textContent,
    lead: [...document.querySelectorAll("[data-hero] p")].map((p) => p.textContent).find((t) => /Your complete platform/.test(t)),
    ctas: [...document.querySelectorAll("[data-hero] a")].map((a) => a.textContent).filter((t) => /Explore|How It/.test(t)),
    stats: [...document.querySelectorAll("[data-hero] ul > li")].map((li) => li.textContent),
  }));
  check(JSON.stringify(s.words) === JSON.stringify(["Funding.", "Housing.", "Support."]), `AC-H20: hero words are ${JSON.stringify(s.words)}`);
  check(s.lead === "Your complete platform for navigating student life in Austria. Find bonuses, secure housing, and connect with roommates – all in one place.", "AC-H20: the lead sentence changed");
  check(JSON.stringify(s.ctas) === JSON.stringify(["Explore Bonuses", "How It Works"]), `AC-H20: CTAs are ${JSON.stringify(s.ctas)}`);
  check(JSON.stringify(s.stats) === JSON.stringify(["€2,400+Average bonus value per student", "5,000+Students supported", "2 weeksAverage time to find housing"]), `AC-H20: stats are ${JSON.stringify(s.stats)}`);
  await context.close();
});

// ---------------------------------------------------------------- AC-H26: no press request on 12 routes, and the switched-on build
await section("AC-H26", async () => {
  const routes = ["/", "/bonuses", "/housing", "/find-buddy", "/how-it-works", "/blog", "/faq", "/contact", "/legal", "/login", "/signup", "/nowhere"];
  const { context, page, ledger } = await open();
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "load" });
    await page.waitForTimeout(400);
  }
  check(!ledger.requests.some((r) => /aau\.at/.test(r.url)), "AC-H26: a request went to aau.at");
  await context.close();
  if (given) return skip("AC-H26", "the VITE_AAU_PRESS=1 build is skipped against a given server");
  // a second build with the switch on and a fixture, then removed
  const press = "public/aau-press";
  const fixture = join(press, "A2-aau-luftbild-steinthaler-1104.webp");
  mkdirSync(press, { recursive: true });
  writeFileSync(fixture, readFileSync("public/media/photos/campus-aerial-1104.webp"));
  try {
    const build = spawnSync(npm, ["run", "build", "--", "--base", "/", "--outDir", "dist-press", "--emptyOutDir"], { shell: win, encoding: "utf8", env: { ...process.env, VITE_AAU_PRESS: "1", MSYS_NO_PATHCONV: "1" } });
    check(build.status === 0, "AC-H26: the VITE_AAU_PRESS=1 build failed");
    const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
    const js = walk("dist-press").filter((f) => f.endsWith(".js")).map((f) => readFileSync(f, "utf8")).join("\n");
    check(/Steinthaler/.test(js), "AC-H26: with the switch on, the press credit is not in the build (the switch does nothing)");
  } finally {
    rmSync(press, { recursive: true, force: true });
    rmSync("dist-press", { recursive: true, force: true });
  }
  note("AC-H26 off in the public build (no press strings, no aau.at request on 12 routes); the switched-on build carries the credit, and its fixture is deleted");
});

// ---------------------------------------------------------------- AC-H27: OCR, when available
await section("AC-H27", async () => {
  const has = spawnSync(win ? "where" : "which", ["tesseract"], { encoding: "utf8" });
  if (has.status !== 0) return skip("AC-H27", "tesseract is not on the path: no OCR was run; the check is by eye (reported)");
  const files = ["public/media/hero/desk.poster.webp", "public/media/hero/desk.poster-phone.webp", "public/media/photos/campus-aerial-1600.webp"];
  for (const f of files) {
    const out = execFileSync("tesseract", [f, "stdout"], { encoding: "utf8" });
    check(!/[A-Za-zÄÖÜäöüß]{3,}/.test(out), `AC-H27: tesseract read "${out.trim().slice(0, 40)}" in ${f}`);
  }
});

await browser.close();
stopServer();
console.log(report.join("\n"));
if (skipped.length) console.log("\nSKIPPED (not passed):\n" + skipped.map((s) => " - " + s).join("\n"));
if (failures.length) {
  console.error("\nFAIL");
  for (const f of failures) console.error(" - " + f);
  process.exit(1);
}
console.log("\nOK: hero checks passed");
