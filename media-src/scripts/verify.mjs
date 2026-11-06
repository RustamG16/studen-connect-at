// Verifies the rendered rows: ffprobe facts, bytes against ceiling, loop check (PSNR of first vs last
// frame) and a contact sheet per clip in out/sheets/. Run from media-src/ with FFMPEG and FFPROBE set.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const media = path.resolve(root, "../public/media");
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const FFPROBE = process.env.FFPROBE || "ffprobe";
const KB = 1000;
fs.mkdirSync(path.join(root, "out/sheets"), { recursive: true });

const probe = (f) => {
  const r = spawnSync(FFPROBE, ["-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration",
    "-of", "json", f], { encoding: "utf8" });
  return JSON.parse(r.stdout);
};
const psnr = (f, n) => {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-i", f, "-i", f, "-filter_complex",
    `[0:v]select=eq(n\\,0),setpts=PTS-STARTPTS[a];[1:v]select=eq(n\\,${n - 1}),setpts=PTS-STARTPTS[b];[a][b]psnr`,
    "-f", "null", "-"], { encoding: "utf8" });
  const m = (r.stderr || "").match(/average:([\d.inf]+)/);
  return m ? m[1] : "?";
};
// moov before mdat: read atom order
const faststart = (f) => {
  const b = fs.readFileSync(f);
  return b.indexOf("moov") > 0 && b.indexOf("moov") < b.indexOf("mdat");
};

const rows = [];
const banners = ["bonuses", "housing", "find-buddy", "how-it-works"];
const cards = ["home-bonuses", "home-housing", "home-roommates", "home-guidance", "how-profile", "how-matched", "how-documents", "how-support"];

for (const [dir, names, mp4Max, webmMax, w, h, maxDur] of [
  ["banners", banners, 350, 280, 854, 480, 5.1],
  ["cards", cards, 90, 70, 480, 360, 4.1],
]) {
  for (const n of names) {
    const mp4 = path.join(media, dir, `${n}.mp4`);
    const webm = path.join(media, dir, `${n}.webm`);
    const p = probe(mp4);
    const v = p.streams.find((s) => s.codec_type === "video");
    const audio = p.streams.some((s) => s.codec_type === "audio") || probe(webm).streams.some((s) => s.codec_type === "audio");
    const frames = Number(v.nb_frames);
    const posterName = dir === "banners" ? `${n}.poster.webp` : `${n}.poster.webp`;
    const files = [`${n}.mp4`, `${n}.webm`, posterName].concat(dir === "cards" ? [`${n}.poster-192.webp`] : []);
    const sizes = Object.fromEntries(files.map((f) => [f, fs.statSync(path.join(media, dir, f)).size]));
    const limit = dir === "banners"
      ? { [`${n}.mp4`]: mp4Max, [`${n}.webm`]: webmMax, [posterName]: 30 }
      : { [`${n}.mp4`]: mp4Max, [`${n}.webm`]: webmMax, [posterName]: 14, [`${n}.poster-192.webp`]: 5 };
    const over = files.filter((f) => sizes[f] > limit[f] * KB);
    const loop = psnr(mp4, frames);
    const sheet = path.join(root, "out/sheets", `${dir}-${n}.png`);
    spawnSync(FFMPEG, ["-v", "error", "-y", "-i", mp4, "-vf", dir === "banners" ? "fps=2,scale=284:-1,tile=5x2" : "fps=2,scale=240:-1,tile=4x2", "-frames:v", "1", sheet]);
    rows.push({
      file: `${dir}/${n}`, codec: v.codec_name, dims: `${v.width}x${v.height}`, okDims: v.width === w && v.height === h,
      fps: v.r_frame_rate, frames, dur: Number(p.format.duration), okDur: Number(p.format.duration) <= maxDur,
      audio, faststart: faststart(mp4), sizes, over, loopPsnr: loop,
    });
  }
}
const og = path.join(media, "posters/og.jpg");
rows.push({ file: "posters/og.jpg", bytes: fs.statSync(og).size, over: fs.statSync(og).size > 80 * KB });
for (const n of ["blog-bonuses", "blog-housing", "blog-buddy", "blog-lifestyle"]) {
  const f = path.join(media, "posters", `${n}.webp`), s = path.join(media, "posters", `${n}-192.webp`);
  rows.push({ file: `posters/${n}`, bytes: fs.statSync(f).size, small: fs.statSync(s).size,
    over: fs.statSync(f).size > 20 * KB || fs.statSync(s).size > 5 * KB });
}
fs.writeFileSync(path.join(root, "out/verify.json"), JSON.stringify(rows, null, 2));
for (const r of rows) console.log(JSON.stringify(r));
