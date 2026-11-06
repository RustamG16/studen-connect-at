// GitHub Pages base-path proof. Serves `dist` under /studen-connect-at/ the way Pages does (404.html for unknown paths,
// plain 404 outside the base), then drives it with Playwright. Exit code 1 on any failed request, console error or check.
//   npm run build && node qa/pages-base.test.mjs      (the production build carries the Pages base)
//   QA_CHANNEL=chrome node qa/pages-base.test.mjs     the same in the installed Chrome (or msedge)
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const BASE = "/studen-connect-at/";
const PORT = 4181;
const ORIGIN = `http://localhost:${PORT}`;
const DIST = "dist";
if (!existsSync(join(DIST, "index.html"))) {
  console.error("dist/index.html is missing: run `npm run build` first.");
  process.exit(1);
}
if (!readFileSync(join(DIST, "index.html"), "utf8").includes(`${BASE}assets/`)) {
  console.error(`dist was not built with base ${BASE}: run \`npm run build\` (not --base /).`);
  process.exit(1);
}
// The Pages workflow runs `cp dist/index.html dist/404.html`; here the server answers unknown paths with index.html and a 404 status.
const fallback = readFileSync(join(DIST, "index.html"));

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".mp4": "video/mp4", ".webm": "video/webm", ".txt": "text/plain",
};
const server = createServer((req, res) => {
  const url = new URL(req.url, ORIGIN);
  if (!url.pathname.startsWith(BASE)) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("not under the base");
  }
  const rel = normalize(decodeURIComponent(url.pathname.slice(BASE.length))).replace(/^([/\\])+/, "");
  let file = join(DIST, rel);
  if (rel === "" || (existsSync(file) && statSync(file).isDirectory())) file = join(file, "index.html");
  if (!file.startsWith(DIST) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": TYPES[".html"] });
    return res.end(fallback);
  }
  const data = readFileSync(file);
  const range = req.headers.range;
  const type = TYPES[extname(file)] ?? "application/octet-stream";
  if (range && /^bytes=/.test(range)) {
    const [a, b] = range.replace("bytes=", "").split("-");
    const start = Number(a);
    const end = b ? Number(b) : data.length - 1;
    res.writeHead(206, { "content-type": type, "accept-ranges": "bytes", "content-range": `bytes ${start}-${end}/${data.length}`, "content-length": end - start + 1 });
    return res.end(data.subarray(start, end + 1));
  }
  res.writeHead(200, { "content-type": type, "accept-ranges": "bytes", "content-length": data.length });
  res.end(data);
});
await new Promise((r) => server.listen(PORT, r));

const failures = [];
const log = [];
const check = (cond, message) => {
  if (!cond) failures.push(message);
};
const browser = await chromium.launch(process.env.QA_CHANNEL ? { channel: process.env.QA_CHANNEL } : {});

/** One page with its request/console ledger. */
async function open(viewport = { width: 1440, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const ledger = { requests: [], bad: [], consoleErrors: [], pageErrors: [], docs404: [] };
  page.on("response", (response) => {
    const url = response.url();
    if (!url.startsWith(ORIGIN)) return;
    const path = new URL(url).pathname;
    ledger.requests.push(`${response.status()} ${path}`);
    if (response.status() >= 400) {
      // Pages answers a deep link with 404.html and status 404: that is the document, and it is expected.
      if (response.request().resourceType() === "document") ledger.docs404.push(path);
      else ledger.bad.push(`${response.status()} ${path}`);
    }
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText ?? "";
    if (request.url().startsWith(ORIGIN) && !/ERR_ABORTED/.test(failure)) ledger.bad.push(`failed ${request.url()} ${failure}`);
  });
  page.on("console", (message) => {
    // A document 404 is logged by Chrome as "Failed to load resource"; the ledger above already judges it.
    if (message.type() === "error" && !/Failed to load resource.*404/.test(message.text())) ledger.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => ledger.pageErrors.push(String(error)));
  return { context, page, ledger };
}

function judge(name, ledger, allowDoc404 = false) {
  check(ledger.bad.length === 0, `${name}: failed requests: ${ledger.bad.join(", ")}`);
  check(ledger.consoleErrors.length === 0, `${name}: console errors: ${ledger.consoleErrors.join(" | ")}`);
  check(ledger.pageErrors.length === 0, `${name}: page errors: ${ledger.pageErrors.join(" | ")}`);
  if (!allowDoc404) check(ledger.docs404.length === 0, `${name}: unexpected document 404: ${ledger.docs404.join(", ")}`);
  check(!ledger.requests.some((r) => !r.includes(BASE)), `${name}: request outside the base: ${ledger.requests.filter((r) => !r.includes(BASE)).join(", ")}`);
}

const underBase = (page) => new URL(page.url()).pathname.startsWith(BASE);
const pathOf = (page) => new URL(page.url()).pathname;
const settle = async (page) => {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(2200); // MediaLoop starts a clip after `load` and idle (<= 1.5 s)
};

// 1. Cold loads of public routes (the document is a 404.html answer except for the root), then the banner clips.
const routes = ["", "housing", "bonuses", "how-it-works", "blog", "faq", "does-not-exist"];
for (const route of routes) {
  const { context, page, ledger } = await open();
  await page.goto(ORIGIN + BASE + route, { waitUntil: "load" });
  await settle(page);
  check(underBase(page), `cold ${route || "/"}: left the base (${pathOf(page)})`);
  const title = await page.title();
  const h1 = await page.locator("h1").first().innerText().catch(() => "");
  check(h1.length > 0, `cold ${route || "/"}: no h1 rendered`);
  const images = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc));
  check(images.length === 0, `cold ${route || "/"}: broken images: ${images.join(", ")}`);
  const banner = await page.locator('figure[data-mode="loop"]').count();
  if (banner) {
    const playing = await page.locator('figure[data-mode="loop"][data-playing]').count();
    const source = await page.evaluate(() => document.querySelector('figure[data-mode="loop"] video')?.currentSrc ?? "");
    check(playing > 0, `cold ${route}: banner clip is not playing (src ${source || "none"})`);
    log.push(`  banner ${route}: playing=${playing}, src=${source.replace(ORIGIN, "")}`);
  }
  judge(`cold ${route || "/"}`, ledger, route !== "");
  log.push(`cold  ${(BASE + route).padEnd(34)} h1="${h1.slice(0, 40)}" title="${title.slice(0, 40)}" requests=${ledger.requests.length} docs404=${ledger.docs404.length} bad=${ledger.bad.length}`);
  if (route === "housing") log.push("  housing requests:\n    " + ledger.requests.filter((r) => /media|fonts|\.json|\.css/.test(r)).join("\n    "));
  await context.close();
}

// 2. Navigation by link from the home page (client side, no document request), through the nav.
{
  const { context, page, ledger } = await open();
  await page.goto(ORIGIN + BASE, { waitUntil: "load" });
  await settle(page);
  for (const [label, path] of [["Housing", "housing"], ["Bonuses", "bonuses"], ["Find Buddy", "find-buddy"], ["Home", ""]]) {
    const link = page.locator("nav[aria-label=\"Main\"] a").filter({ hasText: new RegExp(`^\\s*${label}\\s*$`, "i") }).first();
    if (!(await link.count())) {
      check(false, `nav: no "${label}" link`);
      continue;
    }
    await link.click();
    await page.waitForURL(`**${BASE}${path}`, { timeout: 5000 }).catch(() => {});
    await settle(page);
    check(pathOf(page) === BASE + path.replace(/\/$/, "") || pathOf(page) === BASE + path, `nav ${label}: landed on ${pathOf(page)}`);
    const playing = await page.locator('figure[data-mode="loop"][data-playing]').count();
    if (await page.locator('figure[data-mode="loop"]').count()) check(playing > 0, `nav ${label}: banner clip is not playing`);
    log.push(`nav   ${label} -> ${pathOf(page)} (banner playing=${playing})`);
  }
  await page.goBack();
  await page.waitForTimeout(500);
  check(underBase(page), `back left the base (${pathOf(page)})`);
  judge("navigation", ledger);
  await context.close();
}

// 3. Mock auth. Unauthenticated deep link, login, cold dashboard routes, both logouts.
{
  const { context, page, ledger } = await open();
  await page.goto(ORIGIN + BASE + "dashboard/housing", { waitUntil: "load" });
  await settle(page);
  check(pathOf(page) === BASE + "login", `protected cold load went to ${pathOf(page)}, expected ${BASE}login`);
  log.push(`auth  unauthenticated cold /dashboard/housing -> ${pathOf(page)}`);

  await page.fill("#email", "student@example.test");
  await page.fill("#password", "secret123");
  await page.getByRole("button", { name: /^log in|^sign in|^login/i }).first().click();
  await page.waitForURL(`**${BASE}dashboard`, { timeout: 8000 }).catch(() => {});
  check(pathOf(page) === BASE + "dashboard", `login landed on ${pathOf(page)}`);
  log.push(`auth  login -> ${pathOf(page)}`);

  // Navigation inside the dashboard (sidebar links).
  const sidebarLink = page.locator('a[href$="/dashboard/housing"]:visible').first();
  await sidebarLink.waitFor({ timeout: 8000 }).catch(() => {});
  if (await sidebarLink.count()) {
    await sidebarLink.click();
    await page.waitForURL(`**${BASE}dashboard/housing`, { timeout: 5000 }).catch(() => {});
  }
  check(pathOf(page) === BASE + "dashboard/housing", `dashboard link landed on ${pathOf(page)}`);

  // Cold deep dashboard routes while authenticated (localStorage survives the reload).
  for (const route of ["dashboard/bonuses", "dashboard/settings"]) {
    await page.goto(ORIGIN + BASE + route, { waitUntil: "load" });
    await settle(page);
    check(pathOf(page) === BASE + route, `authenticated cold ${route} ended on ${pathOf(page)}`);
    log.push(`auth  cold authenticated ${BASE}${route} -> ${pathOf(page)}`);
  }

  // Sidebar mock logout: a full navigation to the base.
  const sidebarLogout = page.getByRole("button", { name: /log ?out|sign out/i }).first();
  if (await sidebarLogout.count()) {
    await sidebarLogout.click();
    await page.waitForURL(ORIGIN + BASE, { timeout: 5000 }).catch(() => {});
    check(pathOf(page) === BASE, `sidebar logout landed on ${pathOf(page)}`);
    log.push(`auth  sidebar logout -> ${pathOf(page)}`);
  } else {
    check(false, "dashboard: no logout button");
  }

  // Navbar logout on a public page (clears the mock user).
  await page.goto(ORIGIN + BASE + "housing", { waitUntil: "load" });
  await settle(page);
  const menu = page.locator("nav[aria-label=\"Main\"] button").filter({ has: page.locator("svg.lucide-user") }).first();
  if (await menu.count()) {
    await menu.click();
    await page.getByRole("menuitem", { name: /log out/i }).click();
    await page.waitForTimeout(400);
    const user = await page.evaluate(() => localStorage.getItem("user"));
    check(user === null, "navbar logout did not clear the mock user");
    check(underBase(page), `navbar logout left the base (${pathOf(page)})`);
    log.push(`auth  navbar logout -> user=${user}, path=${pathOf(page)}`);
  } else {
    check(false, "navbar: no user menu while authenticated");
  }
  judge("auth", ledger, true);
  await context.close();
}

// 4. A phone viewport on the home page: the hero posters and sequence frames.
{
  const { context, page, ledger } = await open({ width: 390, height: 844 });
  await page.goto(ORIGIN + BASE, { waitUntil: "load" });
  await settle(page);
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).map((i) => i.currentSrc));
  check(broken.length === 0, `phone home: broken images: ${broken.join(", ")}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 0, `phone home: horizontal overflow ${overflow}px`);
  judge("phone home", ledger);
  log.push(`phone ${BASE} requests=${ledger.requests.length} bad=${ledger.bad.length}`);
  await context.close();
}

// 5. The hero desk (AC-H18) at 1440: the poster, the mark's frame and the clip all resolve under the base, and the hero scrubs.
{
  const { context, page, ledger } = await open({ width: 1440, height: 900 });
  await page.goto(ORIGIN + BASE, { waitUntil: "load" });
  await settle(page);
  const seek = async (b) => {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(b * 0.6 * 900));
    await page.waitForTimeout(1800);
    return page.evaluate(() => document.querySelector("[data-hero-desk] video")?.currentTime ?? null);
  };
  const t0 = await seek(0);
  const t1 = await seek(1);
  check(t0 !== null && t1 !== null && t1 > t0 + 1, `hero desk: the clip did not scrub under the base (currentTime ${t0} -> ${t1})`);
  const served = (name) => ledger.requests.filter((r) => r.includes(BASE + name));
  for (const name of ["media/hero/desk.poster.webp", "media/dragonfly/s384/frame-00.webp"]) {
    check(served(name).some((r) => /^(200|206|304) /.test(r)), `hero desk: ${name} did not resolve under the base`);
  }
  check(served("media/hero/desk.webm").length + served("media/hero/desk.mp4").length > 0, "hero desk: no clip request under the base");
  const frames = ledger.requests.filter((r) => /s384\/frame-\d\d/.test(r) && r.includes(BASE) && /^(200|206|304) /.test(r)).length;
  check(frames >= 16, `hero desk: only ${frames} of 16 mark frames resolved under the base`);
  judge("hero desk 1440", ledger);
  log.push(`hero  desk under ${BASE}: poster, ${frames} frames and the clip resolve; currentTime ${t0 ?? "none"} -> ${t1 ?? "none"}`);
  await context.close();
}
{
  const { context, page, ledger } = await open({ width: 390, height: 844 });
  await page.goto(ORIGIN + BASE, { waitUntil: "load" });
  await settle(page);
  check(ledger.requests.some((r) => r.includes(BASE + "media/hero/desk.poster-phone.webp") && /^(200|206|304) /.test(r)), "hero desk phone: desk.poster-phone.webp did not resolve under the base");
  await context.close();
}

await browser.close();
server.close();
console.log(log.join("\n"));
if (failures.length) {
  console.error("\nFAIL");
  for (const f of failures) console.error(" - " + f);
  process.exit(1);
}
console.log("\nOK: pages-base checks passed");
