/**
 * Resolves a root-absolute path of a file in `public/` (e.g. `/media/banners/x`) against the Vite base, so the same code
 * works at `/` in development and at `/studen-connect-at/` on GitHub Pages. Relative and external URLs pass through.
 * Router `Link`/`navigate` paths do not use this: `BrowserRouter basename` already handles them.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function asset(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path;
  return `${BASE}${path}`;
}
