/**
 * AAU press photos (manifest A64). Off. Switch on only in a local build, after AAU's written consent is filed in .olympus/.
 * No file exists in the repository: public/aau-press/ is gitignored, and the Pages build runs from a clean checkout without
 * VITE_AAU_PRESS, so none of the strings below reach dist/ (the build replaces the variable and drops the dead branch).
 * Local preview for AAU, after consent only: `VITE_AAU_PRESS=1 npm run build`, with the files in public/aau-press/. Never deployed.
 */
export const AAU_PRESS = import.meta.env.VITE_AAU_PRESS === "1";

export const AAU_PRESS_SLOTS = {
  why: {
    ref: "A2",
    base: "/aau-press/A2-aau-luftbild-steinthaler",
    credit: "Foto: Gert Steinthaler",
    alt: "Aerial view of the university campus in Klagenfurt",
  },
} as const;
