/**
 * The hero desk's landing data (manifest A56), written by write-data.mjs in the hero-desk render folder.
 * u runs across and v down, as fractions of the 960 px frame (the phone still for `phone`).
 * HERO_DESK_FRAMES = 0 switches the pass off: the hero is then exactly as it was before it (line-art mark, today's beat 2).
 */
export const HERO_DESK_FRAMES = 72;
export const HERO_DESK_FPS = 30;

/** The right notebook page's centre at frame 0 and at the last frame. Between frames 61 and 71 it moves by at most 0.0000. */
export const landing = {
  first: { u: 0.57, v: 0.39 },
  last: { u: 0.6, v: 0.37 },
} as const;

/** The same page in the phone still. */
export const phone = { landing: { u: 0.41, v: 0.65 } } as const;
