import { asset } from "@/lib/asset";

/**
 * The hero desk clip: a scrub surface, never played (build plan, "Embedding contract, hero clip"). WebM (VP9), then MP4
 * (H.264), then the poster. Each file is set on `video.src` directly: a `<source>` only reports a file that cannot be
 * fetched, and a file that starts and then fails to decode is reported on the `<video>` as `error` (MediaError 3 or 4).
 * `remotion-web-media` section 6 times `currentTime` after `play()`; a scrubbed clip never plays, so the same failure is a
 * seek that has not reached `seeked` within 1.5 s. After the last candidate the video is removed and the poster stays.
 */
const FPS = 30;
const STALL_MS = 1500;

const CANDIDATES = [
  { url: "/media/hero/desk.webm", type: 'video/webm; codecs="vp9"' },
  { url: "/media/hero/desk.mp4", type: "video/mp4" },
];

export interface DeskVideo {
  /** The frame the timeline wants. Seeks are issued only when none is pending, so a fast scroll drops frames. */
  seek(frame: number): void;
  destroy(): void;
}

/** `host` receives the `<video>`; `stage` carries `data-desk` ("poster" until the first seek completes, then "video"). */
export function createDeskVideo(stage: HTMLElement, host: HTMLElement, onFail: () => void): DeskVideo {
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.loop = false;
  video.width = 960;
  video.height = 960;
  video.disablePictureInPicture = true;
  video.tabIndex = -1;
  video.setAttribute("aria-hidden", "true");
  const list = CANDIDATES.filter((c) => video.canPlayType(c.type) !== "");

  let at = -1;
  let target = 0;
  let shown = -1;
  let pending = -1;
  let seeking = false;
  let visible = true;
  let revealed = false;
  let dead = false;
  let stall = 0;
  let raf = 0;

  const pump = () => {
    raf = 0;
    if (dead) return;
    if (!seeking && visible && !document.hidden && video.readyState >= 1 && target !== shown) {
      seeking = true;
      pending = target;
      window.clearTimeout(stall);
      stall = window.setTimeout(advance, STALL_MS);
      video.currentTime = (pending + 0.5) / FPS;
    }
    if (visible && !document.hidden) raf = requestAnimationFrame(pump);
  };
  const wake = () => {
    if (!raf && !dead) raf = requestAnimationFrame(pump);
  };

  function advance() {
    if (dead) return;
    window.clearTimeout(stall);
    seeking = false;
    shown = -1;
    at += 1;
    if (at >= list.length) {
      destroy();
      stage.dataset.desk = "poster";
      onFail();
      return;
    }
    video.src = asset(list[at].url);
    video.load();
  }

  // The first seek is issued once the metadata is in; the video fades in only after it completes, over its identical poster.
  const onMeta = () => {
    wake();
  };
  const onSeeked = () => {
    if (dead) return;
    window.clearTimeout(stall);
    // A stream that breaks after its first frames can "complete" a seek without moving (it stays on the last frame it could
    // decode, and fires no `error`): a seek that lands more than two frames from where it was sent counts as a failure.
    if (Math.abs(video.currentTime - (pending + 0.5) / FPS) > 2 / FPS) return advance();
    seeking = false;
    shown = pending;
    if (!revealed) {
      revealed = true;
      stage.dataset.desk = "video";
    }
    wake();
  };
  const onVisibility = () => wake();
  const observer = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) wake();
  });

  video.addEventListener("loadedmetadata", onMeta);
  video.addEventListener("seeked", onSeeked);
  video.addEventListener("error", advance);
  document.addEventListener("visibilitychange", onVisibility);
  observer.observe(stage);

  function destroy() {
    if (dead) return;
    dead = true;
    window.clearTimeout(stall);
    cancelAnimationFrame(raf);
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    video.removeEventListener("loadedmetadata", onMeta);
    video.removeEventListener("seeked", onSeeked);
    video.removeEventListener("error", advance);
    video.pause();
    video.removeAttribute("src");
    video.load(); // frees the decoder
    video.remove();
    stage.dataset.desk = "poster";
  }

  host.append(video);
  video.preload = "auto";
  advance();

  return {
    seek(frame) {
      target = frame;
      wake();
    },
    destroy,
  };
}
