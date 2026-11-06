// Mobile budgets (Convenium.Design mobile-app-shell). Exit code 1 when a route regresses.
//   npm run qa:mobile                         builds, serves `vite preview`, asserts, stops the server
//   node qa/mobile.test.mjs http://host:port  asserts against a server that is already running
// Needs the dev dependency `playwright` and its Chromium (`npx playwright install chromium`).
import { spawn, spawnSync } from "node:child_process";
import { chromium } from "playwright";

const PORT = 4173;
const given = process.argv[2];
const base = (given || `http://localhost:${PORT}`).replace(/\/$/, "");

// [route, budget in phone screens at 390 x 844]
const routes = [
  ["/", 10],
  ["/bonuses", 8],
  ["/how-it-works", 8],
  ["/housing", 8],
  ["/find-buddy", 8],
  ["/faq", 8],
  ["/contact", 8],
  ["/legal", 8],
  ["/blog", 8],
  ["/login", 8],
  ["/signup", 8],
  ["/nowhere", 8], // the 404
];
const sizes = [[320, 568], [360, 780], [375, 812], [390, 844], [430, 932]];

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

const phone = (w, h, extra = {}) => ({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, ...extra });
const failures = [];
const rows = [];
const browser = await chromium.launch();

try {
  for (const [route, budget] of routes) {
    for (const [w, h] of sizes) {
      const ctx = await browser.newContext(phone(w, h));
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base + route, { waitUntil: "networkidle" });
      // Scroll the whole page once so lazy and revealed content is laid out before it is measured.
      for (let i = 0; i < 30; i++) {
        await page.evaluate(() => window.scrollBy(0, innerHeight));
        await page.waitForTimeout(60);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const r = await page.evaluate(() => {
        const d = document.documentElement;
        const bar = document.querySelector("[data-tabbar]");
        const box = bar && bar.getBoundingClientRect();
        const cells = bar ? [...bar.querySelectorAll("a")].map((a) => a.getBoundingClientRect()) : [];
        const primary = bar && bar.querySelector(".m-tab-primary");
        const menu = document.querySelector('button[aria-label="Toggle menu"]');
        const mb = menu && menu.getBoundingClientRect();
        return {
          layoutW: Math.max(innerWidth, d.scrollWidth),
          screens: d.scrollHeight / innerHeight,
          under24: [...document.querySelectorAll("a,button,input,select,[role=button]")].filter((e) => {
            const b = e.getBoundingClientRect();
            return b.width > 0 && (b.width < 24 || b.height < 24);
          }).length,
          smallInputs: [...document.querySelectorAll("input,select,textarea")].filter(
            (e) => parseFloat(getComputedStyle(e).fontSize) < 16,
          ).length,
          // Content a `clip` hides still counts: text and controls must end inside the viewport.
          pastEdge: [...document.querySelectorAll("a,button,input,select,textarea,h1,h2,h3,h4,p,li,label,summary")]
            .filter((e) => {
              if (e.closest("[aria-hidden='true'],[data-hero-mark],.sr-only")) return false;
              const b = e.getBoundingClientRect();
              return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== "hidden" && b.right > innerWidth + 0.5;
            })
            .map((e) => `${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 24)}" to ${Math.round(e.getBoundingClientRect().right)}`),
          bodyFont: parseFloat(getComputedStyle(document.body).fontSize),
          tabbar: Boolean(bar && getComputedStyle(bar).display !== "none"),
          barAtBottom: Boolean(box && Math.abs(box.bottom - innerHeight) < 1 && box.width >= innerWidth - 1),
          cellsOk: cells.length === 5 && cells.every((c) => c.width >= 44 && c.height >= 44),
          labels: bar ? [...bar.querySelectorAll("a")].map((a) => a.textContent.trim()) : [],
          primaryOk: Boolean(primary && primary.getBoundingClientRect().height >= 44),
          menuOk: Boolean(mb && mb.width >= 44 && mb.height >= 44 && mb.top >= 0 && mb.bottom <= innerHeight),
          hasMenu: Boolean(menu),
          headerSignUp: [...document.querySelectorAll("nav[aria-label=Main] a")].filter(
            (a) => a.textContent.trim() === "Sign Up" && a.offsetParent,
          ).length,
        };
      });
      const tag = `${route} @${w}`;
      if (r.layoutW > w) failures.push(`${tag}: layout ${r.layoutW}px wider than ${w}px`);
      if (r.pastEdge.length) failures.push(`${tag}: ${r.pastEdge.length} elements end past the right edge, e.g. ${r.pastEdge[0]}`);
      if (r.under24) failures.push(`${tag}: ${r.under24} targets under 24px`);
      if (r.smallInputs) failures.push(`${tag}: ${r.smallInputs} inputs under 16px`);
      if (r.bodyFont < 16) failures.push(`${tag}: body ${r.bodyFont}px < 16px`);
      if (!r.tabbar) failures.push(`${tag}: tab bar missing`);
      else {
        if (!r.barAtBottom) failures.push(`${tag}: tab bar not fixed to the bottom edge`);
        if (!r.cellsOk) failures.push(`${tag}: tab bar needs five cells of at least 44 px`);
        if (!r.primaryOk) failures.push(`${tag}: primary cell under 44 px`);
        if (r.labels.join("|") !== "Home|Bonuses|Housing|Find Buddy|Sign Up") failures.push(`${tag}: labels ${r.labels.join("|")}`);
      }
      if (r.hasMenu && !r.menuOk) failures.push(`${tag}: menu button not 44 px in view`);
      if (r.headerSignUp) failures.push(`${tag}: header Sign Up still visible on a phone`);
      if (w === 390) {
        rows.push(`${route.padEnd(16)} ${r.screens.toFixed(1).padStart(5)} screens (budget ${budget})`);
        if (r.screens > budget) failures.push(`${tag}: ${r.screens.toFixed(1)} screens > ${budget}`);
      }
      if (errors.length) failures.push(`${tag}: page errors: ${errors[0]}`);
      await ctx.close();
    }
  }

  // The bar hides under the menu sheet and while a text field has focus, not after a tick.
  {
    const ctx = await browser.newContext(phone(390, 844));
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const display = () => page.evaluate(() => getComputedStyle(document.querySelector("[data-tabbar]")).display);
    await page.click('button[aria-label="Toggle menu"]');
    await page.waitForSelector('[role="dialog"]');
    if ((await display()) !== "none") failures.push("/ @390: tab bar visible under the menu sheet");
    await page.keyboard.press("Escape");
    await page.waitForSelector('[role="dialog"]', { state: "detached" });
    await page.goto(base + "/login", { waitUntil: "networkidle" });
    if ((await display()) === "none") failures.push("/login @390: tab bar hidden without focus");
    await page.focus("input");
    if ((await display()) !== "none") failures.push("/login @390: tab bar visible while a field has focus");
    // A tick raises no keyboard: Sign Up stays one thumb away.
    for (const route of ["/", "/bonuses"]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      const label = page.getByText("I'm under 24").first();
      await label.scrollIntoViewIfNeeded();
      await label.tap();
      await page.waitForTimeout(400);
      if (!(await page.evaluate(() => document.activeElement?.type === "checkbox")))
        failures.push(`${route} @390: tapping "I'm under 24" did not focus the checkbox, so the tab-bar check proved nothing`);
      if ((await display()) === "none") failures.push(`${route} @390: tab bar hidden after a tick`);
    }
    await ctx.close();
  }

  // Signed in: the primary cell becomes Dashboard, and /dashboard has no bar.
  {
    const ctx = await browser.newContext(phone(390, 844));
    await ctx.addInitScript(() =>
      localStorage.setItem("user", JSON.stringify({ id: "qa", name: "QA", email: "qa@example.test" })),
    );
    const page = await ctx.newPage();
    await page.goto(base + "/bonuses", { waitUntil: "networkidle" });
    const last = await page.locator("[data-tabbar] a").last().innerText();
    if (last !== "Dashboard") failures.push(`signed in: primary cell reads "${last}"`);
    await page.goto(base + "/dashboard", { waitUntil: "networkidle" });
    if (await page.locator("[data-tabbar]").count()) failures.push("/dashboard: tab bar rendered");
    await ctx.close();
  }

  // Reduced motion: the h1 is fully opaque (self and ancestors) on every route.
  {
    const ctx = await browser.newContext(phone(390, 844, { reducedMotion: "reduce" }));
    const page = await ctx.newPage();
    for (const [route] of routes) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      const o = await page.evaluate(() => {
        const h = document.querySelector("h1");
        if (!h) return null;
        let min = 1;
        for (let e = h; e; e = e.parentElement) min = Math.min(min, parseFloat(getComputedStyle(e).opacity));
        return min;
      });
      if (o === null) failures.push(`${route} reduced motion: no h1`);
      else if (o < 0.95) failures.push(`${route} reduced motion: h1 opacity ${o} < 0.95`);
    }
    await ctx.close();
  }

  // Desktop keeps its layout: no tab bar at 1280, and nothing wider than the window.
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const desk = await ctx.newPage();
    for (const route of ["/", "/bonuses"]) {
      await desk.goto(base + route, { waitUntil: "networkidle" });
      const bar = await desk.waitForSelector("[data-tabbar]", { state: "attached", timeout: 15000 }).catch(() => null);
      if (!bar) failures.push(`${route} @1280: tab bar not rendered`);
      else if (await bar.evaluate((el) => getComputedStyle(el).display !== "none"))
        failures.push(`${route} @1280: tab bar visible on desktop`);
      if (await desk.evaluate(() => document.documentElement.scrollWidth > innerWidth))
        failures.push(`${route} @1280: horizontal overflow`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  stopServer();
}

console.log(rows.join("\n"));
if (failures.length) {
  console.error("\nMobile budget failures:\n  " + failures.join("\n  "));
  process.exit(1);
}
console.log(`\nMobile budgets OK: ${routes.length} routes x ${sizes.length} widths (right edge checked), reduced motion, signed-in, 1280 desktop.`);
