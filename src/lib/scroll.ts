import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis + ScrollTrigger, ported from Education4Students (3a08f08) and fixed per 06-build-plan.md:
 * no scrollerProxy and no ScrollTrigger.defaults (Lenis's README integrates without them), the
 * `load` listener is removed with the function that was added, and ScrollTrigger refreshes after
 * `document.fonts.ready`.
 *
 * This file imports GSAP at the top: only the home motion chunk may import it.
 * Lenis stays off on coarse pointers (it never takes touch: syncTouch is false) and on reduced motion.
 */
gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
let scrollInitialized = false;
const readyCallbacks = new Set<() => void>();

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function coarsePointer(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

function notifyScrollReady() {
  readyCallbacks.forEach((cb) => cb());
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

export function onScrollReady(callback: () => void): () => void {
  readyCallbacks.add(callback);
  if (scrollInitialized) {
    requestAnimationFrame(callback);
  }
  return () => readyCallbacks.delete(callback);
}

export function initSmoothScroll(): () => void {
  if (scrollInitialized) {
    return () => {};
  }

  scrollInitialized = true;

  const refresh = () => ScrollTrigger.refresh();
  const onLoad = () => refresh();
  let disposed = false;

  const afterFonts = () => {
    document.fonts?.ready.then(() => {
      if (!disposed) refresh();
    });
  };

  // Native scroll on reduced motion and touch-first devices: ScrollTrigger still works, Lenis is not created.
  if (prefersReducedMotion() || coarsePointer()) {
    requestAnimationFrame(() => {
      refresh();
      notifyScrollReady();
    });
    afterFonts();
    return () => {
      disposed = true;
      scrollInitialized = false;
    };
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenisInstance = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  requestAnimationFrame(() => {
    refresh();
    notifyScrollReady();
    requestAnimationFrame(refresh);
  });

  window.addEventListener("load", onLoad);
  afterFonts();

  return () => {
    disposed = true;
    window.removeEventListener("load", onLoad);
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenisInstance = null;
    scrollInitialized = false;
    refresh();
  };
}

/** Pauses smooth scrolling (e.g. while the mobile menu is open). */
export function setScrollLocked(locked: boolean): void {
  if (lenisInstance) {
    if (locked) lenisInstance.stop();
    else lenisInstance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToTop(immediate = true): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
  }
}

/** Jumps to an exact scroll position, used to land keyboard focus on a finished pinned frame. */
export function scrollToPosition(y: number): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo({ top: y, behavior: "auto" });
  }
}

export function scrollToElement(selector: string, offset = -80): void {
  const el = document.querySelector(selector);
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el as HTMLElement, { offset });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export { gsap, ScrollTrigger };
