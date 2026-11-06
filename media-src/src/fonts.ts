import { continueRender, delayRender, staticFile } from "remotion";

const faces: [number, string][] = [
  [700, "plus-jakarta-sans-latin-700-normal.woff2"],
  [800, "plus-jakarta-sans-latin-800-normal.woff2"],
];

let started = false;
export const loadFonts = () => {
  if (started) return;
  started = true;
  const handle = delayRender("fonts");
  Promise.all(
    faces.map(async ([weight, file]) => {
      const face = new FontFace("Plus Jakarta Sans", `url(${staticFile(`fonts/${file}`)})`, {
        weight: String(weight),
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      throw e;
    });
};
export const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";
