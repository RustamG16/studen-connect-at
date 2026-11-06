import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/** The guard for the GSAP chunk (DESIGN.md, Motion). Outside it the page runs CSS and IntersectionObserver only. */
export const MOTION_GUARD =
  "(min-width: 1024px) and (pointer: fine) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const PHONE = "(max-width: 767.98px)";

const REVEAL_MARGIN = "0px 0px -10% 0px";
const STAGGER_MAX = 8;
const FONTS_CAP_MS = 1200;
const SETTLE_MS = 800 + 2 * 60 + 80;
const COUNT_MS = 900;

const noop = () => {};
const belowFold = (el: Element) => el.getBoundingClientRect().top >= window.innerHeight * 0.9;

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );
}

/** Beat 1: the words are readable from the first frame; they settle after the fonts, capped at 1200 ms. */
export function settleHero(hero: HTMLElement): () => void {
  let settleTimer = 0;
  let cancelled = false;
  const run = () => {
    if (cancelled) return;
    hero.dataset.settle = "run";
    settleTimer = window.setTimeout(() => {
      hero.dataset.settle = "done";
    }, SETTLE_MS);
  };
  const cap = new Promise((resolve) => window.setTimeout(resolve, FONTS_CAP_MS));
  Promise.race([document.fonts?.ready ?? Promise.resolve(), cap]).then(run);
  return () => {
    cancelled = true;
    window.clearTimeout(settleTimer);
    hero.dataset.settle = "done";
  };
}

/** Once per item: hidden states go on after mount, and only below the fold. Items already in view stay final. */
export function revealOnce(items: HTMLElement[]): () => void {
  if (!items.length || !("IntersectionObserver" in window)) return noop;

  const show = (el: HTMLElement) => {
    el.dataset.reveal = "done";
    observer.unobserve(el);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty("--i", String(Math.min(i, STAGGER_MAX - 1)));
          show(el);
        });
    },
    { rootMargin: REVEAL_MARGIN },
  );

  const pending = items.filter(belowFold);
  pending.forEach((el) => {
    el.dataset.reveal = "pending";
    observer.observe(el);
  });

  const showAll = () => pending.forEach(show);
  const onFocus = (event: FocusEvent) => show(event.currentTarget as HTMLElement);
  pending.forEach((el) => el.addEventListener("focusin", onFocus));
  window.addEventListener("beforeprint", showAll);

  return () => {
    observer.disconnect();
    window.removeEventListener("beforeprint", showAll);
    pending.forEach((el) => {
      el.removeEventListener("focusin", onFocus);
      delete el.dataset.reveal;
      el.style.removeProperty("--i");
    });
  };
}

/** The phone Ledger's figure: counts once on entry, by requestAnimationFrame, ending exactly on the DOM's own string. */
function countOnce(digits: HTMLElement): () => void {
  const final = digits.textContent ?? "";
  const target = Number(final.replace(/\D/g, ""));
  if (!target || !belowFold(digits) || !("IntersectionObserver" in window)) return noop;

  let frame = 0;
  const finish = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    digits.textContent = final;
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_MS);
        if (t === 1) return finish();
        digits.textContent = Math.round(target * (1 - Math.pow(1 - t, 4))).toLocaleString("en-US");
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    },
    { rootMargin: REVEAL_MARGIN },
  );

  digits.textContent = "0";
  observer.observe(digits);
  window.addEventListener("beforeprint", finish);
  return () => {
    window.removeEventListener("beforeprint", finish);
    finish();
  };
}

/**
 * Every home beat that needs no GSAP: 1 (hero settle), 3 (list rules), 6 (Why checks), and the Ledger's stacked states.
 * Returns whether the guard has ever matched, which is what loads the GSAP chunk.
 */
export function useHomeReveals(rootRef: RefObject<HTMLElement>): boolean {
  const guard = useMediaQuery(MOTION_GUARD);
  const reduced = useMediaQuery(REDUCED);
  const phone = useMediaQuery(PHONE);

  // After the first commit, so the chunk's layout effect always finds rootRef attached. Sticky: gsap.matchMedia
  // handles the guard from then on.
  const [loadChunk, setLoadChunk] = useState(false);
  useEffect(() => {
    if (guard) setLoadChunk(true);
  }, [guard]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const cleanups = [
      ...Array.from(root.querySelectorAll<HTMLElement>("[data-settle]"), settleHero),
      revealOnce(Array.from(root.querySelectorAll<HTMLElement>(".counter-list > li"))),
      revealOnce(Array.from(root.querySelectorAll<HTMLElement>("[data-why-row]"))),
    ];
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [rootRef, reduced]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || guard) return;
    const cleanups = [revealOnce(Array.from(root.querySelectorAll<HTMLElement>("[data-ledger-row]")))];
    // M5: Your ledger's five blank lines draw once on entry, from 768 px. Phones collapse the unwritten rows.
    if (!phone) cleanups.push(revealOnce(Array.from(root.querySelectorAll<HTMLElement>(".written-row"))));
    const digits = root.querySelector<HTMLElement>("[data-count-digits]");
    if (phone && digits) cleanups.push(countOnce(digits));
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [rootRef, reduced, guard, phone]);

  return loadChunk;
}
