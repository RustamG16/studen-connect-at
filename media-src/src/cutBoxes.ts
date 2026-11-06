// Where the object sits inside each 960 x 960 cut-out (alpha above 16, measured with PIL's getbbox on public/inputs/cut-*.webp).
// A cut-out is mostly transparent padding, so scaling the square makes a flat roof or a ring read tiny. `fitCut` scales the object
// instead: it fills the box given, whichever side runs out first, and is centred on (cx, cy).
const BOXES: Record<string, [number, number, number, number]> = {
  "cut-coin": [280, 272, 680, 677],
  "cut-discs": [133, 223, 829, 710],
  "cut-keys": [179, 89, 780, 846],
  "cut-ring": [121, 99, 841, 839],
  "cut-roof": [58, 312, 903, 651],
  "cut-sheets": [165, 83, 800, 859],
  "cut-signpost": [228, 96, 757, 878],
  "cut-tag": [288, 107, 673, 852],
  "cut-tram": [37, 258, 924, 687],
};
const SQUARE = 960;

export const fitCut = (cut: string, maxW: number, maxH: number, cx: number, cy: number) => {
  const [x0, y0, x1, y1] = BOXES[cut.replace(/\.webp$/, "")] ?? [0, 0, SQUARE, SQUARE];
  const scale = Math.min(maxW / (x1 - x0), maxH / (y1 - y0));
  return {
    size: SQUARE * scale,
    left: cx - ((x0 + x1) / 2) * scale,
    top: cy - ((y0 + y1) / 2) * scale,
  };
};
