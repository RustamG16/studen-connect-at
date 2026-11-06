import { useEffect, useState } from "react";
import DragonflyMark from "@/components/brand/DragonflyMark";

const SHOW_AFTER_MS = 300;
const DRAW_MS = 1600;
const SEEN_KEY = "c4s.seen";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on a repeat visit. The flag is written at once, so the first load is the only one that draws. */
const seenBefore = () => {
  try {
    const seen = window.localStorage.getItem(SEEN_KEY) === "1";
    window.localStorage.setItem(SEEN_KEY, "1");
    return seen;
  } catch {
    return false;
  }
};

/**
 * Suspense fallback for the lazy routes. It does not block: nothing shows for the first 300 ms,
 * then the line-art mark appears. The mark draws once, in at most 1.6 s, on the first visit only;
 * repeat visits and reduced motion get it fully drawn and still.
 */
const LoadingScreen = () => {
  const [visible, setVisible] = useState(false);
  const [draw] = useState(() => !reducedMotion() && !seenBefore());

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return <div className="min-h-[100svh] bg-background" aria-hidden />;

  return (
    <div
      role="status"
      className="loader-in flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-background text-depth"
    >
      <DragonflyMark
        className={`h-32 w-32 md:h-40 md:w-40 ${draw ? "loader-mark" : ""}`}
        style={draw ? ({ "--draw-ms": `${DRAW_MS}ms` } as React.CSSProperties) : undefined}
      />
      <p className="t-eyebrow text-ink-2">Care4Students</p>
    </div>
  );
};

export default LoadingScreen;
