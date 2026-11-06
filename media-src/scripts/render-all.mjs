// Renders every Remotion row of the manifest (A27-A43) and encodes it under its byte budget.
// Run from media-src/:  node scripts/render-all.mjs [--webm-only] [rowId ...]
//   --webm-only  re-encodes the WebM files from the masters already in out/master/ (no Remotion render, no MP4, no posters).
// Outputs go to ../public/media/{banners,cards,posters}. The site never imports from this folder.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.resolve(root, "..");
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const REMOTION = path.join(root, "node_modules/.bin/remotion.cmd");
const KB = 1000;

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { cwd: root, encoding: "utf8", shell: cmd.endsWith(".cmd"), ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")}\n${r.stdout}\n${r.stderr}`);
  return r;
};
const ff = (...a) => run(FFMPEG, ["-v", "error", "-y", ...a]);
const size = (f) => fs.statSync(f).size;
const mk = (d) => fs.mkdirSync(d, { recursive: true });

// ---- inputs prepared once
const prepare = () => {
  const clean = path.join(root, "public/inputs/paper-clean.jpg");
  if (!fs.existsSync(clean)) {
    // the right edge of the CC0 scan carries scan marks: use the clean left part
    ff("-i", path.join(root, "public/inputs/paper.jpg"), "-vf", "crop=1780:1201:0:0", "-q:v", "2", clean);
  }
  for (const n of ["bonuses", "housing", "find-buddy", "how"]) {
    const d = path.join(root, "public/work", n);
    if (!fs.existsSync(d)) {
      mk(d);
      ff("-i", path.join(root, `public/inputs/clip-${n}.mp4`), "-q:v", "2", path.join(d, "%04d.jpg"));
    }
  }
  run("node", ["scripts/sync-inputs.mjs"]);
};

// ---- rows
const banners = [
  { id: "A27", name: "bonuses", clip: "bonuses", mode: "pingpong", rate: 2, eyebrow: "bonuses" },
  { id: "A28", name: "housing", clip: "housing", mode: "direct", rate: 1, eyebrow: "housing" },
  { id: "A29", name: "find-buddy", clip: "find-buddy", mode: "direct", rate: 1, eyebrow: "find-buddy" },
  { id: "A30", name: "how-it-works", clip: "how", mode: "direct", rate: 1, eyebrow: "how-it-works" },
];
const cards = [
  ["A31", "home-bonuses", "cut-coin"],
  ["A32", "home-housing", "cut-roof"],
  ["A33", "home-roommates", "cut-keys"],
  ["A34", "home-guidance", "cut-signpost"],
  ["A35", "how-profile", "cut-tag"],
  ["A36", "how-matched", "cut-discs"],
  ["A37", "how-documents", "cut-sheets"],
  ["A38", "how-support", "cut-ring"],
];
const posters = [
  ["A39", "blog-bonuses", "cut-coin"],
  ["A40", "blog-housing", "cut-roof"],
  ["A41", "blog-buddy", "cut-keys"],
  ["A42", "blog-lifestyle", "cut-tram"],
];

const report = [];
const log = (row) => {
  report.push(row);
  console.log(JSON.stringify(row));
};

const props = (obj, file) => {
  fs.writeFileSync(file, JSON.stringify(obj));
  return file;
};

// encode loops: raise the CRF until the file fits its ceiling
const encodeMp4 = (master, out, budget, startCrf, extra = []) => {
  for (let crf = startCrf; crf <= 40; crf += 1) {
    ff("-i", master, "-c:v", "libx264", "-preset", "veryslow", "-crf", String(crf), "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", "-an", ...extra, out);
    if (size(out) <= budget) return crf;
  }
  throw new Error(`mp4 over budget: ${out}`);
};
// The Remotion masters are full-range (yuvj420p). A full-range VP9 stream makes Chrome and Edge's VP9 decoder fail with
// PIPELINE_ERROR_DECODE a frame after `playing` (reproduced in the installed Chrome 156 and Edge 156, 2026-11-04), while the same
// picture as limited-range plays. So the WebM is converted to limited range (BT.601 matrix, as the master is) and tagged, which
// also makes it ~16 % smaller. The MP4 keeps its range; H.264 plays either way.
const LIMITED_RANGE = [
  "-vf", "scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt601,format=yuv420p",
  "-color_range", "tv", "-colorspace", "smpte170m", "-color_primaries", "smpte170m", "-color_trc", "smpte170m",
];
const encodeWebm = (master, out, budget, startCrf, extra = []) => {
  for (let crf = startCrf; crf <= 63; crf += 1) {
    ff("-i", master, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", String(crf), "-row-mt", "1",
      ...LIMITED_RANGE, "-an", ...extra, out);
    if (size(out) <= budget) return crf;
  }
  throw new Error(`webm over budget: ${out}`);
};
const encodeWebp = (src, out, budget, extra = []) => {
  for (let q = 82; q >= 20; q -= 4) {
    ff("-i", src, ...extra, "-frames:v", "1", "-c:v", "libwebp", "-quality", String(q), out);
    if (size(out) <= budget) return q;
  }
  throw new Error(`webp over budget: ${out}`);
};

const lastFrame = (n) => `select=eq(n\\,${n - 1})`;

const renderVideo = (comp, propsFile, master) => {
  mk(path.dirname(master));
  run(REMOTION, ["render", "src/index.ts", comp, master, "--codec=h264", "--muted", "--crf=10",
    "--pixel-format=yuv420p", `--props=${propsFile}`, "--log=error"]);
};

const webmOnly = process.argv.includes("--webm-only");
const only = new Set(process.argv.slice(2).filter((a) => !a.startsWith("--")));
const want = (id) => only.size === 0 || only.has(id);

if (!webmOnly) prepare();
const outRoot = path.join(site, "public/media");
const tmp = path.join(root, "out/work");
mk(tmp);

for (const b of banners.filter((b) => want(b.id))) {
  const dir = path.join(outRoot, "banners");
  mk(dir);
  const master = path.join(root, `out/master/${b.id}.mp4`);
  if (webmOnly) {
    const webm = path.join(dir, `${b.name}.webm`);
    const crfWebm = encodeWebm(master, webm, 280 * KB, 34);
    log({ id: b.id, webm: size(webm), crfWebm, webmOnly: true });
    continue;
  }
  renderVideo("Banner", props({ clip: b.clip, sourceFrames: 121, mode: b.mode, rate: b.rate, eyebrow: b.eyebrow },
    path.join(tmp, `${b.id}.json`)), master);
  const mp4 = path.join(dir, `${b.name}.mp4`);
  const webm = path.join(dir, `${b.name}.webm`);
  const poster = path.join(dir, `${b.name}.poster.webp`);
  const crfMp4 = encodeMp4(master, mp4, 350 * KB, 22);
  const crfWebm = encodeWebm(master, webm, 280 * KB, 34);
  const q = encodeWebp(mp4, poster, 30 * KB);
  log({ id: b.id, mp4: size(mp4), crfMp4, webm: size(webm), crfWebm, poster: size(poster), q, mode: b.mode });
}

for (const [id, name, cut] of cards.filter(([id]) => want(id))) {
  const dir = path.join(outRoot, "cards");
  mk(dir);
  const master = path.join(root, `out/master/${id}.mp4`);
  if (webmOnly) {
    const webm = path.join(dir, `${name}.webm`);
    const crfWebm = encodeWebm(master, webm, 70 * KB, 34);
    log({ id, webm: size(webm), crfWebm, webmOnly: true });
    continue;
  }
  renderVideo("Card", props({ cut: `${cut}.webp` }, path.join(tmp, `${id}.json`)), master);
  const mp4 = path.join(dir, `${name}.mp4`);
  const webm = path.join(dir, `${name}.webm`);
  const poster = path.join(dir, `${name}.poster.webp`);
  const small = path.join(dir, `${name}.poster-192.webp`);
  const crfMp4 = encodeMp4(master, mp4, 90 * KB, 22);
  const crfWebm = encodeWebm(master, webm, 70 * KB, 34);
  const q = encodeWebp(mp4, poster, 14 * KB);
  const qs = encodeWebp(mp4, small, 5 * KB, ["-vf", "scale=192:144:flags=lanczos"]);
  log({ id, mp4: size(mp4), crfMp4, webm: size(webm), crfWebm, poster: size(poster), q, small: size(small), qs });
}

for (const [id, name, cut] of webmOnly ? [] : posters.filter(([id]) => want(id))) {
  const dir = path.join(outRoot, "posters");
  mk(dir);
  const png = path.join(root, `out/master/${id}.png`);
  mk(path.dirname(png));
  run(REMOTION, ["still", "src/index.ts", "BlogPoster", png, `--props=${props({ cut: `${cut}.webp` }, path.join(tmp, `${id}.json`))}`, "--log=error"]);
  const full = path.join(dir, `${name}.webp`);
  const small = path.join(dir, `${name}-192.webp`);
  const q = encodeWebp(png, full, 20 * KB);
  const qs = encodeWebp(png, small, 5 * KB, ["-vf", "scale=192:108:flags=lanczos"]);
  log({ id, poster: size(full), q, small: size(small), qs });
}

if (!webmOnly && want("A43")) {
  const dir = path.join(outRoot, "posters");
  mk(dir);
  const png = path.join(root, "out/master/A43.png");
  mk(path.dirname(png));
  run(REMOTION, ["still", "src/index.ts", "Og", png, "--log=error"]);
  const jpg = path.join(dir, "og.jpg");
  let q = 3;
  for (; q <= 31; q++) {
    ff("-i", png, "-frames:v", "1", "-c:v", "mjpeg", "-q:v", String(q), "-pix_fmt", "yuvj420p", jpg);
    if (size(jpg) <= 80 * KB) break;
  }
  log({ id: "A43", jpg: size(jpg), q });
}

// A --webm-only run leaves the full render log of the last complete run alone.
if (!webmOnly) fs.writeFileSync(path.join(root, "out/render-log.json"), JSON.stringify(report, null, 2));
