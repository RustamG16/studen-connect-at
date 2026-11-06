// Drives scene.html in headless Chromium and writes the PNG masters (build plan, "WebGL bounds").
//   node render.mjs                 all 72 frames, the phone still, camera.json
//   node render.mjs 0 18 36         only those frames (plus the phone still with --phone)
//   node render.mjs --phone         only the phone still
// One page and one context for the run. Frames go out in batches of at most 12; each is read back by toDataURL and
// written as a PNG, so a lost context costs one batch: the page is reloaded and the run resumes from the last frame written.
// Options: --lid=45 (degrees the laptop lid leans past vertical), --force (re-render frames that exist).
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const { chromium } = createRequire(path.join(repo, "package.json"))("playwright");

const out = path.join(repo, "media-src/out/hero");
mkdirSync(out, { recursive: true });

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const value = (name, fallback) => {
  const a = flag(name);
  return a && a.includes("=") ? a.split("=")[1] : fallback;
};
const numbers = args.filter((a) => /^\d+$/.test(a)).map(Number);
const wantPhone = Boolean(flag("phone")) || (numbers.length === 0 && !flag("no-phone"));
const wantFrames = flag("phone") && numbers.length === 0 ? [] : numbers.length ? numbers : Array.from({ length: 72 }, (_, i) => i);
const force = Boolean(flag("force"));
const lid = Number(value("lid", 45));

const roots = [
  ["/three/", path.join(here, "node_modules/three/")],
  ["/models/", path.join(repo, "src/assets/hero-pass/models/")],
  ["/textures/", path.join(here, "textures/")],
  ["/", here + path.sep],
];
const types = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".gltf": "model/gltf+json", ".glb": "model/gltf-binary", ".bin": "application/octet-stream", ".jpg": "image/jpeg", ".png": "image/png" };
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const target = url === "/" ? "/scene.html" : url;
  for (const [prefix, dir] of roots) {
    if (!target.startsWith(prefix)) continue;
    const file = path.join(dir, target.slice(prefix.length));
    if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile()) continue;
    res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
    return createReadStream(file).pipe(res);
  }
  res.writeHead(404).end();
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl", "--disable-gpu-vsync"],
});
let page;
const errors = [];
async function open(layout) {
  page?.close().catch(() => {});
  page = await browser.newPage({ viewport: { width: 960, height: 960 } });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && errors.push(m.text()));
  await page.goto(`${origin}/scene.html`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  return page.evaluate(([l, lidDeg]) => window.setup(l, { lid: lidDeg }), [layout, lid]);
}
const save = (name, dataUrl) => writeFileSync(path.join(out, name), Buffer.from(dataUrl.split(",")[1], "base64"));

const log = { lid, frames: {}, camera: "orthographic, from above; a tour over the desk: whole desk (f0, zoom 1), backpack (f18, 1.45), laptop (f38, 1.25), notebook right page (f61, 1.1, held to f71); bank up to 4 deg (x) and -2.5 deg (z), flat from b 0.85" };
const t0 = Date.now();

if (wantFrames.length) {
  let info = await open("main");
  log.main = info;
  const queue = wantFrames.filter((i) => force || !existsSync(path.join(out, `frame-${String(i).padStart(3, "0")}.png`)));
  for (let at = 0; at < queue.length; at += 12) {
    const batch = queue.slice(at, at + 12);
    for (const i of batch) {
      let result;
      try {
        result = await page.evaluate((n) => window.renderFrame(n), i);
        if (await page.evaluate(() => window.__lost)) throw new Error("context lost");
      } catch (error) {
        console.warn(`frame ${i}: ${error.message}; reloading the page and retrying`);
        info = await open("main");
        result = await page.evaluate((n) => window.renderFrame(n), i);
      }
      save(`frame-${String(i).padStart(3, "0")}.png`, result.png);
      log.frames[i] = { landing: result.landing, bounds: result.bounds };
      process.stdout.write(`frame ${i} `);
    }
    process.stdout.write("\n");
  }
}

if (wantPhone) {
  const info = await open("phone");
  const result = await page.evaluate(() => window.renderFrame(0));
  save("phone.png", result.png);
  log.phone = { landing: result.landing, bounds: result.bounds, ...info };
}

const logFile = path.join(out, "camera.json");
let previous = {};
try {
  previous = JSON.parse((await import("node:fs")).readFileSync(logFile, "utf8"));
} catch { /* first run */ }
writeFileSync(logFile, JSON.stringify({ ...previous, ...log, frames: { ...previous.frames, ...log.frames } }, null, 1));
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)} s; errors: ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
server.close();
