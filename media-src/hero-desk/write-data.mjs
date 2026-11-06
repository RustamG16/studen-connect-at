// Writes src/data/heroDesk.ts (manifest A56) and the committed camera.json from the render's camera.json in media-src/out/hero/.
//   node write-data.mjs
// landing.first and landing.last are the right notebook page's centre projected into the 960 px frame at frames 0 and 71;
// phone.landing is the same point in the 780 x 360 phone still. All are fractions (u across, v down).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const camera = JSON.parse(readFileSync(path.join(repo, "media-src/out/hero/camera.json"), "utf8"));
const f = camera.frames;
const first = f[0].landing;
const last = f[71].landing;
const phone = camera.phone.landing;
const settle = Math.max(...[...Array(10).keys()].map((k) => Math.hypot(f[62 + k].landing.u - f[61 + k].landing.u, f[62 + k].landing.v - f[61 + k].landing.v)));

const ts = `/**
 * The hero desk's landing data (manifest A56), written by write-data.mjs in the hero-desk render folder.
 * u runs across and v down, as fractions of the 960 px frame (the phone still for \`phone\`).
 * HERO_DESK_FRAMES = 0 switches the pass off: the hero is then exactly as it was before it (line-art mark, today's beat 2).
 */
export const HERO_DESK_FRAMES = 72;
export const HERO_DESK_FPS = 30;

/** The right notebook page's centre at frame 0 and at the last frame. Between frames 61 and 71 it moves by at most ${settle.toFixed(4)}. */
export const landing = {
  first: { u: ${first.u}, v: ${first.v} },
  last: { u: ${last.u}, v: ${last.v} },
} as const;

/** The same page in the phone still. */
export const phone = { landing: { u: ${phone.u}, v: ${phone.v} } } as const;
`;
writeFileSync(path.join(repo, "src/data/heroDesk.ts"), ts);
const slim = { lid: camera.lid, camera: camera.camera, frames: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v])), phone: camera.phone, main: camera.main };
writeFileSync(path.join(here, "camera.json"), JSON.stringify(slim));
console.log({ first, last, phone, settle });
