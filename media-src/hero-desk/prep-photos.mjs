// A62: prepares the photo props for the offline desk render (build plan, "Hero pass addendum").
//   node prep-photos.mjs
// Reads the originals in src/assets/hero-pass/photos/ in place and writes JPEG textures to ./textures/ (gitignored, never served).
// Every texture: crop box, resize, saturation x 0.80, 6 % blend toward cream #fbfaf6, then (for prints) a 4 % cream border.
// Only public-domain photos are inputs (A57-A61). The CC BY-SA aerial (A63) never enters the render.
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const photos = path.resolve(here, "../../src/assets/hero-pass/photos");
const out = path.join(here, "textures");
mkdirSync(out, { recursive: true });

const CREAM = [0xfb, 0xfa, 0xf6];
const SATURATION = 0.8;
const BLEND = 0.06;

// Crop boxes are in the 1280 px originals' pixels: { left, top, width, height }. One per file, with the reason.
const textures = [
  {
    id: "A57-postcard",
    file: "W1-Woerthersee_carinthia.jpg", // the lake with a sailing boat; no text anywhere in the frame
    crop: { left: 0, top: 0, width: 1275, height: 850 },
    size: [512, 341],
    border: 0.04,
  },
  {
    id: "A58-campus-print",
    file: "C7-Klagenfurt_-_University.JPG", // roof, window band and sky. The welcome sign sits at y 432-460 and the orange mark is below the cornice: both are under this box (y 0-425)
    crop: { left: 380, top: 0, width: 637, height: 425 },
    size: [384, 256],
    border: 0.04,
  },
  {
    id: "A59-laptop-screen",
    file: "C8-Klagenfurt_-_Lakeside_Park.JPG", // timber-clad building, trees, meadow; no sign, no person. Fills the screen plane, no border
    crop: { left: 0, top: 20, width: 1280, height: 800 },
    size: [512, 320],
    border: 0,
  },
  {
    id: "A60-lindwurm-print",
    file: "C15-Klagenfurt_-_Lindwurm_-Detail.JPG", // the dragon's head and the water jet against sky
    crop: { left: 180, top: 100, width: 720, height: 720 },
    size: [384, 384],
    border: 0.04,
  },
  {
    id: "A61-map",
    file: "M1-Klagenfurt_-_btv1b8459825t.jpg", // y 190-910 drops the "KLAGENFURT" title (y 135-165), the red BnF stamp and the shelf marks. Blurred on purpose: labels must not be legible in the 960 px frame
    crop: { left: 70, top: 190, width: 960, height: 720 },
    size: [640, 480],
    border: 0,
    blur: 1.1,
  },
];

for (const t of textures) {
  const [w, h] = t.size;
  const inner = t.border ? [Math.round(w * (1 - 2 * t.border)), Math.round(h * (1 - 2 * t.border))] : [w, h];
  let image = sharp(path.join(photos, t.file)).extract(t.crop).resize(inner[0], inner[1], { fit: "fill" }).modulate({ saturation: SATURATION });
  if (t.blur) image = image.blur(t.blur);
  const { data, info } = await image.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 3) {
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - BLEND) + CREAM[c] * BLEND);
  }
  let final = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
  if (t.border) {
    const dx = Math.floor((w - info.width) / 2);
    const dy = Math.floor((h - info.height) / 2);
    final = final.extend({ top: dy, bottom: h - info.height - dy, left: dx, right: w - info.width - dx, background: { r: CREAM[0], g: CREAM[1], b: CREAM[2] } });
  }
  const file = path.join(out, `${t.id}.jpg`);
  await final.jpeg({ quality: 90, chromaSubsampling: "4:4:4" }).toFile(file);
  console.log(t.id, `${w}x${h}`, statSync(file).size, "bytes");
}
