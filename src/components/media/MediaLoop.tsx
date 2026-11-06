import { useEffect, useRef, useState } from "react";
import { readStill, subscribeStill } from "@/lib/ledger";

/**
 * A framed poster that may become a clip (build plan, "Embedding contract"). The poster is always there; the `<video>`
 * is created only on the first intersect after `load` and idle, and only when every condition below holds. Silent,
 * never `autoplay`, never in the first-paint path. A banner loops (its control is "Turn animations off"); a card plays
 * once per entry and rests on its first frame's image.
 */
type Mode = "loop" | "once";
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

interface MediaLoopProps {
  /** Path without extension: `${src}.webm`, `.mp4`, `.poster.webp`, and for cards `.poster-192.webp`. */
  src: string;
  width: number;
  height: number;
  mode: Mode;
  /** The banner's poster is above the fold and may load before `load`; everything else is lazy. */
  eager?: boolean;
  /** Row position, for the 60 ms stagger of cards (at most 8 steps). */
  index?: number;
  /** Largest CSS width. The clip is never shown larger than its source supports. */
  maxWidth: number;
  className?: string;
}

const REDUCED = "(prefers-reduced-motion: reduce)";
// A card plays only where it is big enough to be seen: it is 101 px wide at 768 and 141 at 1024, 207 at 1440 (review R6). Below this it
// stays on its poster; the same line as the GSAP motion, so a tablet gets no clip and no extra bytes.
const WIDE = "(min-width: 1024px)";
const SLOW = ["slow-2g", "2g", "3g"];
const STAGGER_MS = 60;
const STAGGER_MAX = 8;
const IDLE_TIMEOUT_MS = 1500;
// A clip that has started and then stops advancing without raising `error` (a cut or corrupt stream, seen in Chrome and Firefox) is
// treated like an error once its `currentTime` has not moved for this long while it is meant to be playing.
const STALL_MS = 1500;
// Before the first `playing` a slow connection is not a stall, so the clip gets longer to start (a stream that never starts is the same failure).
const START_STALL_MS = 4000;
const STALL_POLL_MS = 250;

const connection = () => (navigator as Navigator & { connection?: Connection }).connection;

/** Reduced motion, saveData, a slow connection and the visitor's own setting all leave the poster alone. */
function clipAllowed(mode: Mode): boolean {
  if (window.matchMedia(REDUCED).matches) return false;
  const link = connection();
  if (link?.saveData || (link?.effectiveType && SLOW.includes(link.effectiveType))) return false;
  if (readStill()) return false;
  return mode === "loop" || window.matchMedia(WIDE).matches;
}

/** After `load`, then idle (a timeout where requestIdleCallback is missing). */
function afterLoadAndIdle(run: () => void): () => void {
  let cancelled = false;
  let cancelIdle = () => {};
  const idle = () => {
    if (cancelled) return;
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS });
      cancelIdle = () => window.cancelIdleCallback(handle);
    } else {
      const handle = window.setTimeout(run, IDLE_TIMEOUT_MS);
      cancelIdle = () => window.clearTimeout(handle);
    }
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", idle);
    cancelIdle();
  };
}

const MediaLoop = ({ src, width, height, mode, eager, index = 0, maxWidth, className }: MediaLoopProps) => {
  const figure = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"pending" | "ok" | "failed">("pending");
  const poster = `${src}.poster.webp`;

  // A cached or eager poster can finish before React attaches onLoad.
  useEffect(() => {
    const img = image.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? "ok" : "failed");
  }, []);

  useEffect(() => {
    const frame = figure.current;
    if (state !== "ok" || !frame) return;

    let video: HTMLVideoElement | null = null;
    let visible = false;
    let broken = false;
    let delay = 0;
    let watchdog = 0;
    let observer: IntersectionObserver | undefined;

    const drop = () => {
      window.clearTimeout(delay);
      window.clearInterval(watchdog);
      if (!video) return;
      video.pause();
      video.remove();
      video = null;
      delete frame.dataset.playing;
    };

    const make = () => {
      const el = document.createElement("video");
      el.muted = true;
      el.playsInline = true;
      el.loop = mode === "loop";
      el.preload = "none";
      el.width = width;
      el.height = height;
      el.poster = poster;
      el.disablePictureInPicture = true;
      el.tabIndex = -1;
      el.setAttribute("aria-hidden", "true");
      // WebM first (smaller), MP4 second. Some decoders accept a type and then fail on the stream (Chrome's VP9 path did on
      // full-range files, PIPELINE_ERROR_DECODE a frame after `playing`), and the browser only falls through to the next
      // <source> when the first cannot load, not when it cannot decode. So a decode error moves on by hand.
      const urls = ["webm", "mp4"].map((type) => `${src}.${type}`);
      for (const url of urls) {
        const source = document.createElement("source");
        source.src = url;
        source.type = `video/${url.slice(url.lastIndexOf(".") + 1)}`;
        el.append(source);
      }
      let at = 0; // index of the source in use; it only moves forward
      const fail = () => {
        broken = true;
        drop();
      };
      // `error` on the element is a decode or network failure of the source in use; before or after `playing`, it is the
      // same: try the next source, and give up (poster only) once every one has failed.
      const advance = () => {
        if (video !== el) return;
        const shown = urls.findIndex((url) => el.currentSrc === new URL(url, window.location.href).href);
        at = Math.max(at, shown) + 1;
        if (at >= urls.length) return fail();
        delete frame.dataset.playing;
        lastTime = -1;
        el.src = urls[at];
        el.load();
        if (visible) play();
      };
      // The stall watchdog, only while the clip is visible and not paused (a card may end; a looping banner never does, so for it `ended` is a stall too): 1.5 s without `currentTime` moving after
      // `playing` (4 s if it never started) moves on to the next source, like `error` does.
      let lastTime = -1;
      let movedAt = 0;
      window.clearInterval(watchdog);
      watchdog = window.setInterval(() => {
        const now = performance.now();
        if (video !== el || !visible || el.paused || (el.ended && mode === "once") || el.currentTime !== lastTime) {
          lastTime = el.currentTime;
          movedAt = now;
          return;
        }
        if (now - movedAt >= (frame.dataset.playing === undefined ? START_STALL_MS : STALL_MS)) {
          movedAt = now;
          advance();
        }
      }, STALL_POLL_MS);
      // A <video> never fires `error` for a failed <source>; the last one says nothing is left to try.
      el.lastElementChild?.addEventListener("error", fail);
      el.addEventListener("error", advance);
      el.addEventListener("playing", () => {
        frame.dataset.playing = "";
      });
      frame.append(el);
      el.preload = "auto";
      video = el;
    };

    const play = () => {
      if (!video || video.ended) return;
      video.muted = true;
      video.play().catch(() => {
        // A low-power mode or a policy may refuse; the poster stays, with no error.
      });
    };

    const update = () => {
      if (broken || !clipAllowed(mode)) return drop();
      if (!visible) return video?.pause();
      if (!video) make();
      window.clearTimeout(delay);
      delay = window.setTimeout(play, mode === "once" ? Math.min(index, STAGGER_MAX - 1) * STAGGER_MS : 0);
    };

    const stopWaiting = afterLoadAndIdle(() => {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          const next = entry.isIntersecting && entry.intersectionRatio >= 0.25;
          // A card replays on every entry; a banner resumes where it was.
          if (next && !visible && mode === "once" && video) video.currentTime = 0;
          visible = next;
          update();
        },
        { threshold: [0.25] },
      );
      observer.observe(frame);
    });

    const queries = [window.matchMedia(REDUCED), window.matchMedia(WIDE)];
    queries.forEach((query) => query.addEventListener("change", update));
    const link = connection();
    link?.addEventListener?.("change", update);
    const unsubscribe = subscribeStill(update);
    window.addEventListener("beforeprint", drop);
    window.addEventListener("afterprint", update);

    return () => {
      stopWaiting();
      observer?.disconnect();
      queries.forEach((query) => query.removeEventListener("change", update));
      link?.removeEventListener?.("change", update);
      unsubscribe();
      window.removeEventListener("beforeprint", drop);
      window.removeEventListener("afterprint", update);
      drop();
    };
  }, [state, src, poster, mode, width, height, index]);

  const card = mode === "once";

  return (
    <figure
      ref={figure}
      data-media={state}
      data-mode={mode}
      className={`media-frame ${className ?? ""}`}
      style={{ aspectRatio: `${width} / ${height}`, maxWidth }}
    >
      <img
        ref={image}
        src={poster}
        {...(card
          ? { srcSet: `${src}.poster-192.webp 192w, ${poster} ${width}w`, sizes: `(min-width: 768px) ${maxWidth}px, 96px` }
          : {})}
        alt=""
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setState("ok")}
        onError={() => setState("failed")}
      />
    </figure>
  );
};

export default MediaLoop;
