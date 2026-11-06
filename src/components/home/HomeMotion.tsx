import { asset } from "@/lib/asset";
import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { DRAGONFLY_FRAMES } from "@/data/dragonflyFrames";
import { HERO_DESK_FRAMES, landing } from "@/data/heroDesk";
import { readStill, subscribeStill } from "@/lib/ledger";
import { gsap, initSmoothScroll, ScrollTrigger, scrollToPosition } from "@/lib/scroll";
import { MOTION_GUARD } from "@/components/home/useHomeReveals";
import { createDeskVideo, type DeskVideo } from "@/components/home/heroDeskVideo";

gsap.registerPlugin(useGSAP);

const frameUrl = (i: number) => asset(`/media/dragonfly/frame-${String(i).padStart(2, "0")}.webp`);
const smallFrameUrl = (i: number) => asset(`/media/dragonfly/s384/frame-${String(i).padStart(2, "0")}.webp`);

/** Frames 00-15, fetched after `load` and idle and decoded before use. Rejects if any fails, so the poster stays. */
function loadFrames(signal: { cancelled: boolean }, urlOf: (i: number) => string = frameUrl): Promise<HTMLImageElement[]> {
  return new Promise((resolve, reject) => {
    const start = () => {
      if (signal.cancelled) return reject(new Error("cancelled"));
      Promise.all(
        Array.from({ length: DRAGONFLY_FRAMES }, (_, i) => {
          const image = new Image();
          image.src = urlOf(i);
          return image.decode().then(() => image);
        }),
      ).then(resolve, reject);
    };
    const idle = () => (window.requestIdleCallback ? window.requestIdleCallback(start) : window.setTimeout(start, 200));
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

/** Beat 2, and its hand-off: the canvas crossfades frames through the hero's height while the stat rule reaches full bleed. */
function dragonfly(root: HTMLElement, context: gsap.Context): () => void {
  const hero = root.querySelector<HTMLElement>("[data-settle]");
  if (!hero) return () => {};
  const rule = hero.querySelector<HTMLElement>("[data-stat-rule]");
  const gutter = parseFloat(getComputedStyle(hero.querySelector(".shell-x") ?? hero).paddingRight) || 0;
  const ruleBase = 1 - gutter / hero.clientWidth;

  // Beat 1 draws the rule to the gutter when this chunk arrives in time; if it is late, the rule simply stays full.
  const extendRule = rule && hero.dataset.settle !== "done";
  if (extendRule) rule.style.setProperty("--rule-settle", String(ruleBase));

  const state = { frame: 0 };
  let frames: HTMLImageElement[] | null = null;
  const canvas = hero.querySelector<HTMLCanvasElement>("[data-dragonfly-canvas]");
  const paint = canvas?.getContext("2d");

  const draw = () => {
    if (!frames || !canvas || !paint) return;
    const i = Math.floor(state.frame);
    const fraction = state.frame - i;
    paint.clearRect(0, 0, canvas.width, canvas.height);
    // Additive on premultiplied alpha is a true crossfade: the frames' transparent areas stay transparent.
    paint.globalCompositeOperation = "lighter";
    paint.globalAlpha = 1 - fraction;
    paint.drawImage(frames[i], 0, 0, canvas.width, canvas.height);
    if (fraction > 0) {
      paint.globalAlpha = fraction;
      paint.drawImage(frames[Math.min(i + 1, frames.length - 1)], 0, 0, canvas.width, canvas.height);
    }
  };

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 },
  });
  timeline.to(state, { frame: Math.max(DRAGONFLY_FRAMES - 1, 0), duration: 1, onUpdate: draw }, 0);
  if (extendRule) timeline.fromTo(rule, { scaleX: ruleBase }, { scaleX: 1, duration: 1, immediateRender: false }, 0);

  const signal = { cancelled: false };
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (DRAGONFLY_FRAMES > 0 && canvas && paint && !saveData) {
    loadFrames(signal)
      .then((loaded) => {
        if (signal.cancelled) return;
        frames = loaded;
        draw();
        context.add(() => {
          gsap.set(canvas, { opacity: 1 });
          gsap.set(hero.querySelector("[data-hero-mark] img"), { opacity: 0 });
        });
      })
      .catch(() => {
        // The poster is already the fallback.
      });
  }

  return () => {
    signal.cancelled = true;
    rule?.style.removeProperty("--rule-settle");
  };
}


// ---- The desk hero (build plan, "Hero pass"): the scrub guard, the pin, the clip and the dragonfly ----

/** Inside MOTION_GUARD, and wide enough for the bleed layout: the only place the clip, the pin and the frames exist. */
const SCRUB_GUARD = `${MOTION_GUARD} and (min-width: 1280px)`;
const SLOW = ["slow-2g", "2g", "3g"];
const LIFT = { u: 0.1, v: -0.03 }; // where the dragonfly drifts while the camera crosses the desk
const IDLE_TIMEOUT_MS = 1500;

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
const connection = () => (navigator as Navigator & { connection?: Connection }).connection;

/** The runtime half of the scrub guard: matchMedia cannot see these. */
function scrubAllowed(): boolean {
  if (HERO_DESK_FRAMES <= 0) return false;
  const link = connection();
  if (link?.saveData || (link?.effectiveType && SLOW.includes(link.effectiveType))) return false;
  return !readStill();
}

const smooth = (t: number) => t * t * (3 - 2 * t);

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

/**
 * Beats 2b and 2c, and the hand-off. The hero is pinned for 60 % of the viewport (native scroll, scrub 1). The clip is shown
 * by `currentTime`, never played; the dragonfly lifts off the notebook page and lands on it again, composited in code.
 */
function deskHero(root: HTMLElement, context: gsap.Context): () => void {
  const hero = root.querySelector<HTMLElement>("[data-hero]");
  const stage = hero?.querySelector<HTMLElement>("[data-hero-desk]");
  const media = stage?.querySelector<HTMLElement>(".hero-media");
  const pos = stage?.querySelector<HTMLElement>("[data-hero-pos]");
  const canvas = stage?.querySelector<HTMLCanvasElement>("[data-dragonfly-canvas]");
  if (!hero || !stage || !media || !pos || !canvas || !scrubAllowed()) return () => {};
  const paint = canvas.getContext("2d");
  const rule = hero.querySelector<HTMLElement>("[data-stat-rule]");
  const gutter = parseFloat(getComputedStyle(hero.querySelector(".shell-x") ?? hero).paddingRight) || 0;
  const ruleBase = 1 - gutter / hero.clientWidth;
  const extendRule = rule && hero.dataset.settle !== "done";
  if (extendRule) rule.style.setProperty("--rule-settle", String(ruleBase));

  const state = { b: 0 };
  let cover = Math.max(stage.clientWidth, stage.clientHeight); // the 960 px square, cover-fitted: its side in CSS px
  let frames: HTMLImageElement[] | null = null;
  let video: DeskVideo | null = null;
  let clipFailed = false;
  const last = DRAGONFLY_FRAMES - 1;

  const draw = (frame: number) => {
    if (!frames || !paint) return;
    const at = Math.min(Math.max(frame, 0), last); // rounding can leave -1e-15 at the end of the landing
    const i = Math.floor(at);
    const fraction = at - i;
    paint.clearRect(0, 0, canvas.width, canvas.height);
    // Additive on premultiplied alpha is a true crossfade: the frames' transparent areas stay transparent.
    paint.globalCompositeOperation = "lighter";
    paint.globalAlpha = 1 - fraction;
    paint.drawImage(frames[i], 0, 0, canvas.width, canvas.height);
    if (fraction > 0) {
      paint.globalAlpha = fraction;
      paint.drawImage(frames[Math.min(i + 1, last)], 0, 0, canvas.width, canvas.height);
    }
  };

  const apply = () => {
    const b = Math.min(Math.max(state.b, 0), 1);
    const lift = Math.sin(Math.PI * Math.min(b / 0.85, 1));
    // If the clip is gone the dragonfly still lifts, and lands back on the same page of the static desk.
    const to = clipFailed ? landing.first : landing.last;
    const e = smooth(b);
    gsap.set(pos, {
      x: ((to.u - landing.first.u) * e + LIFT.u * lift) * cover,
      y: ((to.v - landing.first.v) * e + LIFT.v * lift) * cover,
      scale: 1 + 0.25 * lift,
    });
    draw(b < 0.85 ? (last * b) / 0.85 : last * (1 - (b - 0.85) / 0.15));
    video?.seek(Math.round(b * (HERO_DESK_FRAMES - 1)));
  };

  const navHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: hero,
      start: () => `top ${navHeight()}px`,
      end: () => `+=${Math.round(window.innerHeight * 0.6)}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 1, // the hero's pin is above the Ledger's, whichever is created first
      onRefresh: () => {
        cover = Math.max(stage.clientWidth, stage.clientHeight);
        apply();
      },
    },
  });
  timeline.to(state, { b: 1, duration: 1, onUpdate: apply }, 0);
  if (extendRule) timeline.fromTo(rule, { scaleX: ruleBase }, { scaleX: 1, duration: 1, immediateRender: false }, 0);

  // Neither the clip nor frames 01-15 start until the poster (the LCP element) is in, and `load` and idle have passed.
  const signal = { cancelled: false };
  const poster = stage.querySelector<HTMLImageElement>(".hero-media img");
  const posterLoaded = () =>
    new Promise<boolean>((resolve) => {
      if (!poster) return resolve(false);
      if (poster.complete) return resolve(poster.naturalWidth > 0);
      poster.addEventListener("load", () => resolve(true), { once: true });
      poster.addEventListener("error", () => resolve(false), { once: true });
    });
  const stopWaiting = afterLoadAndIdle(() => {
    posterLoaded().then(async (ok) => {
      // Two frames on, so the poster has been painted (the LCP candidate) before the first clip byte is asked for.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (signal.cancelled || !ok) return;
      video = createDeskVideo(stage, media, () => {
        clipFailed = true;
        video = null;
        apply();
      });
      apply();
      loadFrames(signal, smallFrameUrl)
        .then((loaded) => {
          if (signal.cancelled) return;
          frames = loaded;
          apply();
          context.add(() => {
            gsap.set(canvas, { opacity: 1 });
            gsap.set(pos.querySelector("[data-hero-mark] img"), { opacity: 0 });
          });
        })
        .catch(() => {
          // The static frame 00 is the fallback.
        });
    });
  });

  // The visitor's own settings can change mid-visit: the still setting and the data saver take the clip away at once.
  const onSetting = () => {
    if (!scrubAllowed()) context.revert();
  };
  const link = connection();
  link?.addEventListener?.("change", onSetting);
  const unsubscribe = subscribeStill(onSetting);

  return () => {
    signal.cancelled = true;
    stopWaiting();
    video?.destroy();
    video = null;
    link?.removeEventListener?.("change", onSetting);
    unsubscribe();
    gsap.set(pos, { clearProps: "transform" });
    paint?.clearRect(0, 0, canvas.width, canvas.height);
    rule?.style.removeProperty("--rule-settle");
  };
}

/** Beat 4, pinned: the positions are percent of the pin, so the timeline runs exactly 100 units. */
function ledger(root: HTMLElement): () => void {
  const section = root.querySelector<HTMLElement>("#ledger");
  const digits = section?.querySelector<HTMLElement>("[data-count-digits]");
  if (!section || !digits) return () => {};

  const finalDigits = digits.textContent ?? "";
  const target = Number(finalDigits.replace(/\D/g, ""));
  const rows = gsap.utils.toArray<HTMLElement>("[data-ledger-row]", section);
  const ghosts: HTMLElement[] = [];

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: section, start: "top top", end: "+=220%", pin: true, scrub: 1, invalidateOnRefresh: true },
  });

  // 0-35: the counter runs as line one is written with its description.
  const counter = { value: 0 };
  digits.textContent = "0";
  timeline.to(
    counter,
    {
      value: target,
      duration: 35,
      onUpdate: () => {
        digits.textContent = Math.round(counter.value).toLocaleString("en-US");
      },
    },
    0,
  );
  gsap.utils.toArray<HTMLElement>("[data-ledger-line]", section).forEach((line, i) => {
    timeline.fromTo(line, { opacity: 0, y: "0.5em" }, { opacity: 1, y: 0, duration: 8 }, 4 + i * 8);
  });

  // A row arrives: rule, then the masked line, warm, then settling to canvas. The warm copy is aria-hidden and only
  // its opacity moves, because colour does not animate.
  const write = (row: HTMLElement, at: { rule: number; line: number; lineFor: number; settle: number; settleFor: number }) => {
    gsap.set(row, { overflow: "clip", pointerEvents: "none" });
    timeline.fromTo(row, { "--rule-draw": 0 }, { "--rule-draw": 1, duration: 4 }, at.rule);
    row.querySelectorAll<HTMLElement>("[data-row-line]").forEach((line) => {
      const ghost = line.cloneNode(true) as HTMLElement;
      ghost.removeAttribute("data-row-line");
      ghost.setAttribute("aria-hidden", "true");
      ghost.dataset.ledgerGhost = "";
      Object.assign(ghost.style, { position: "absolute", inset: "0", color: "hsl(var(--warm))", pointerEvents: "none" });
      gsap.set(line, { position: "relative" });
      line.append(ghost);
      ghosts.push(ghost);
      timeline.fromTo(line, { y: () => row.offsetHeight }, { y: 0, duration: at.lineFor }, at.line);
      timeline.fromTo(ghost, { opacity: 1 }, { opacity: 0, duration: at.settleFor }, at.settle);
    });
    timeline.set(row, { pointerEvents: "auto" }, at.line + at.lineFor);
  };

  rows.forEach((row, i) => {
    if (i === 0) {
      write(row, { rule: 14, line: 17, lineFor: 8, settle: 31, settleFor: 4 });
    } else {
      // 35-90: the other five in turn, 11 units each.
      const start = 35 + 11 * (i - 1);
      write(row, { rule: start, line: start + 3, lineFor: 5, settle: start + 8, settleFor: 3 });
    }
  });

  // 90-100: the last line is written. "Apply Now" on all six, the closing CTA, the mint mark. Nothing moves after this.
  rows.forEach((row, i) => {
    timeline.fromTo(row.querySelector("[data-row-apply]"), { opacity: 0 }, { opacity: 1, duration: 2 }, 90 + i * 0.8);
  });
  const cta = section.querySelector("[data-ledger-cta]");
  gsap.set(cta, { pointerEvents: "none" });
  timeline.set(cta, { pointerEvents: "auto" }, 91);
  timeline.fromTo(cta, { opacity: 0, y: "0.5em" }, { opacity: 1, y: 0, duration: 5 }, 91);
  const paths = gsap.utils.toArray<SVGPathElement>("[data-ledger-mark] path", section);
  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: `${length} ${length + 2}`, strokeDashoffset: length + 1 });
  });
  timeline.to(paths, { strokeDashoffset: 0, duration: 5, stagger: 0.5 }, 92);
  timeline.to({}, { duration: 0 }, 100);

  // Keyboard: rows are real links from the start, so focus inside an unfinished pin jumps to the finished frame.
  const trigger = timeline.scrollTrigger as ScrollTrigger;
  const onFocus = () => {
    if (trigger.progress >= 1) return;
    scrollToPosition(trigger.end);
    ScrollTrigger.update();
    trigger.getTween()?.progress(1);
    timeline.progress(1);
  };
  const onBeforePrint = () => timeline.progress(1);
  const onAfterPrint = () => timeline.progress(trigger.progress);
  section.addEventListener("focusin", onFocus);
  window.addEventListener("beforeprint", onBeforePrint);
  window.addEventListener("afterprint", onAfterPrint);

  return () => {
    section.removeEventListener("focusin", onFocus);
    window.removeEventListener("beforeprint", onBeforePrint);
    window.removeEventListener("afterprint", onAfterPrint);
    ghosts.forEach((ghost) => ghost.remove());
    digits.textContent = finalDigits;
  };
}

/** Beat 8: the closing rule draws under the wordmark, over its own height. */
function footerRule(root: HTMLElement) {
  const trigger = root.querySelector("[data-footer-rule]");
  const line = trigger?.querySelector("[data-footer-line]");
  if (!trigger || !line) return;
  gsap.fromTo(
    line,
    { scaleX: 0 },
    { scaleX: 1, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom bottom", scrub: 1 } },
  );
}

/**
 * The GSAP chunk, loaded only when the guard matches on `/`: beats 2, 4 and 8, and Lenis. `from` states exist only inside
 * gsap.matchMedia, so crossing the guard reverts to the static end state. Renders nothing.
 */
const HomeMotion = ({ rootRef }: { rootRef: RefObject<HTMLElement> }) => {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const media = gsap.matchMedia();
      // The hero's pin is made first, so the Ledger's positions include its spacing; `refreshPriority` keeps that true when
      // crossing 1280 px later.
      if (HERO_DESK_FRAMES > 0) media.add(SCRUB_GUARD, (context) => deskHero(root, context));
      media.add(MOTION_GUARD, (context) => {
        // Top to bottom, so ScrollTrigger's refresh sees the pin spacing in page order.
        const cleanups = [HERO_DESK_FRAMES > 0 ? () => {} : dragonfly(root, context), ledger(root)];
        footerRule(root);
        cleanups.push(initSmoothScroll());
        return () => cleanups.forEach((cleanup) => cleanup());
      });
      return () => media.revert();
    },
    { scope: rootRef },
  );

  return null;
};

export default HomeMotion;
