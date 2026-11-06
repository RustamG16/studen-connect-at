import type { SVGProps } from "react";

/**
 * The Care4Students dragonfly as seven centre-line strokes, no fill, in `currentColor`.
 * Master for the nav and footer mark, loader, sidebar, hero line art and favicon, and the
 * coordinates the 3D frames are modelled from. Traced from `src/assets/dragonfly.png`.
 * Decorative by default; pass `title` to name it.
 */
type DragonflyMarkProps = Omit<SVGProps<SVGSVGElement>, "title"> & { title?: string };

const DRAGONFLY_PATHS = [
  "M 240.7,124.2 C 232.2,103.8 218.6,86.8 200.8,76.7",
  "M 271.3,124.2 C 279.8,103.8 293.4,86.8 311.2,76.7",
  "M 227.9,144.7 A 28.1,25.5,0,1,1,284.1,144.7 A 28.1,25.5,0,1,1,227.9,144.7 Z M 245.8,169.3 C 244.1,195.7 239,216.9 238.2,233.9 C 237.3,272.1 247.5,357.1 250.9,425.1 C 251.8,437 260.2,437 261.1,425.1 C 264.5,357.1 274.7,272.1 273.9,233.9 C 273,216.9 267.9,195.7 266.2,169.3",
  "M 60.5,199.9 C 50.3,180.4 37.6,144.7 29.1,115.8 C 75.8,110.7 126.8,120.8 177.8,151.4 C 207.6,171.9 228.8,199.9 239,221.2",
  "M 451.5,199.9 C 461.7,180.4 474.4,144.7 482.9,115.8 C 436.2,110.7 385.2,120.8 334.2,151.4 C 304.4,171.9 283.2,199.9 273,221.2",
  "M 237.3,231.3 C 194.8,238.2 143.8,248.3 114.1,267.9 C 94.5,280.6 82.6,299.4 76.7,315.5 C 75.8,321.4 86,324 101.3,324.9 C 135.3,328.2 169.3,321.4 194.8,308.7 C 216.1,297.6 230.5,282.4 237.3,267.9 Z",
  "M 274.7,231.3 C 317.2,238.2 368.2,248.3 397.9,267.9 C 417.5,280.6 429.4,299.4 435.4,315.5 C 436.2,321.4 426,324 410.7,324.9 C 376.7,328.2 342.7,321.4 317.2,308.7 C 295.9,297.6 281.5,282.4 274.7,267.9 Z",
] as const;

const DragonflyMark = ({ title, strokeWidth = 11, ...props }: DragonflyMarkProps) => (
  <svg
    viewBox="0 0 512 512"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    role={title ? "img" : undefined}
    aria-hidden={title ? undefined : true}
    focusable="false"
    {...props}
  >
    {title ? <title>{title}</title> : null}
    {DRAGONFLY_PATHS.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

export default DragonflyMark;
