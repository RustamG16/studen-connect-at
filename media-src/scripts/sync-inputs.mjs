// Reads the site's design.json and font files; writes nothing outside media-src/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.resolve(root, "..");

const design = JSON.parse(fs.readFileSync(path.join(site, "design.json"), "utf8"));
const t = design.tokens;
const out = {
  colors: t.colors,
  motion: {
    micro: t.motion.micro,
    move: t.motion.move,
    scene: t.motion.scene,
    stagger: t.motion.stagger,
    "ease-out": t.motion["ease-out"],
    "ease-in-out": t.motion["ease-in-out"],
  },
  spacing: { rule: t.spacing.rule, "rule-hover": t.spacing["rule-hover"] },
  rounded: t.rounded,
};
fs.writeFileSync(path.join(root, "src/tokens.generated.json"), JSON.stringify(out, null, 2));

fs.mkdirSync(path.join(root, "public/fonts"), { recursive: true });
for (const f of ["plus-jakarta-sans-latin-700-normal.woff2", "plus-jakarta-sans-latin-800-normal.woff2"]) {
  fs.copyFileSync(path.join(site, "public/fonts", f), path.join(root, "public/fonts", f));
}
fs.copyFileSync(
  path.join(site, "public/media/dragonfly/frame-00.webp"),
  path.join(root, "public/inputs/dragonfly-frame-00.webp"),
);
console.log("synced tokens, fonts, dragonfly frame 00");
