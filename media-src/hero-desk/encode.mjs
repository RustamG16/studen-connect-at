// Encodes the PNG masters in media-src/out/hero/ into the files the site ships (manifest A51-A55). Local ffmpeg 8.1.2 and sharp. No AI, 0 credits.
//   node encode.mjs
// Bytes are ceilings, not targets: a file over its ceiling is re-encoded at a higher CRF or lower quality, never shipped over,
// and never given fewer frames. Prints the sizes and SHA-256 of every output and writes media-src/out/hero/encode-log.json.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const masters = path.join(repo, "media-src/out/hero");
const heroOut = path.join(repo, "public/media/hero");
const flyOut = path.join(repo, "public/media/dragonfly/s384");
mkdirSync(heroOut, { recursive: true });
mkdirSync(flyOut, { recursive: true });

const CEIL = { webm: 2_600_000, mp4: 3_000_000, poster: 90 * 1024, phone: 50 * 1024, fly: 10 * 1024, flyAll: 150 * 1024 };
const log = {};
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

function ffmpeg(args) {
  const run = spawnSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { encoding: "utf8" });
  if (run.status !== 0) throw new Error(run.stderr || "ffmpeg failed");
}

// The PNGs are full-range sRGB. The clip is limited-range BT.709 YUV, tagged so a browser converts it back to the same colours.
const toYuv = "scale=960:960:flags=lanczos:in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p";
const tags = ["-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"];
const input = ["-framerate", "30", "-i", path.join(masters, "frame-%03d.png")];

function fit(name, file, ceiling, start, step, max, build) {
  for (let crf = start; crf <= max; crf += step) {
    build(crf);
    const bytes = statSync(file).size;
    if (bytes <= ceiling) {
      log[name] = { file: path.relative(repo, file).replaceAll("\\", "/"), bytes, crf, ceiling, sha256: sha(file) };
      console.log(name, `crf ${crf}`, bytes, "bytes (ceiling", ceiling + ")");
      return;
    }
  }
  throw new Error(`${name} does not fit ${ceiling} bytes up to crf ${max}`);
}

// A51: VP9, all-intra, limited range, no audio
fit("A51 desk.webm", path.join(heroOut, "desk.webm"), CEIL.webm, 26, 2, 52, (crf) =>
  ffmpeg([...input, "-vf", toYuv, "-c:v", "libvpx-vp9", "-g", "1", "-crf", String(crf), "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "0", ...tags, "-an", path.join(heroOut, "desk.webm")]),
);

// A52: H.264 High, all-intra, faststart, no audio
fit("A52 desk.mp4", path.join(heroOut, "desk.mp4"), CEIL.mp4, 20, 2, 44, (crf) =>
  ffmpeg([...input, "-vf", toYuv, "-c:v", "libx264", "-profile:v", "high", "-x264-params", "keyint=1:min-keyint=1", "-crf", String(crf), "-preset", "slow", ...tags, "-movflags", "+faststart", "-an", path.join(heroOut, "desk.mp4")]),
);

// A53 and A54: opaque WebP stills of the same master frames
async function still(name, source, file, ceiling, size) {
  for (let q = 90; q >= 30; q -= 4) {
    let image = sharp(path.join(masters, source));
    if (size) image = image.resize(size[0], size[1], { fit: "fill", kernel: "lanczos3" });
    await image.webp({ quality: q, smartSubsample: false, effort: 6 }).toFile(file);
    const bytes = statSync(file).size;
    if (bytes <= ceiling) {
      log[name] = { file: path.relative(repo, file).replaceAll("\\", "/"), bytes, quality: q, ceiling, sha256: sha(file) };
      console.log(name, `q ${q}`, bytes, "bytes (ceiling", ceiling + ")");
      return;
    }
  }
  throw new Error(`${name} does not fit ${ceiling}`);
}
await still("A53 desk.poster.webp", "frame-000.png", path.join(heroOut, "desk.poster.webp"), CEIL.poster, [960, 960]);
await still("A54 desk.poster-phone.webp", "phone.png", path.join(heroOut, "desk.poster-phone.webp"), CEIL.phone, [780, 360]);

// A55: the existing dragonfly frames (A02), resized to 384 px, alpha kept, 10 KB each
let flyTotal = 0;
const flyLog = [];
for (let i = 0; i < 16; i++) {
  const n = String(i).padStart(2, "0");
  const from = path.join(repo, `public/media/dragonfly/frame-${n}.webp`);
  const to = path.join(flyOut, `frame-${n}.webp`);
  let done = false;
  for (let q = 72; q >= 30 && !done; q -= 4) {
    await sharp(from).resize(384, 384, { fit: "fill", kernel: "lanczos3" }).webp({ quality: q, alphaQuality: Math.min(q + 10, 100), effort: 6 }).toFile(to);
    const bytes = statSync(to).size;
    if (bytes <= CEIL.fly) {
      flyTotal += bytes;
      flyLog.push({ frame: n, bytes, quality: q, sha256: sha(to) });
      done = true;
    }
  }
  if (!done) throw new Error(`frame ${n} does not fit ${CEIL.fly}`);
}
if (flyTotal > CEIL.flyAll) throw new Error(`the 16 frames total ${flyTotal}, over ${CEIL.flyAll}`);
log["A55 s384 frames"] = { files: "public/media/dragonfly/s384/frame-00..15.webp", total: flyTotal, ceiling: CEIL.flyAll, frames: flyLog };
console.log("A55 16 frames", flyTotal, "bytes (ceiling", CEIL.flyAll + ")");

writeFileSync(path.join(masters, "encode-log.json"), JSON.stringify(log, null, 1));
void existsSync;
