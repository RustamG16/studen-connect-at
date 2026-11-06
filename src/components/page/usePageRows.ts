import { useEffect, useRef } from "react";
import { revealOnce } from "@/components/home/useHomeReveals";

/** Beat 3 on a subpage: every `[data-rule-row]` and numbered `li` under the ref draws its rule once, on entry. */
export function usePageRows<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return revealOnce(Array.from(root.querySelectorAll<HTMLElement>("[data-rule-row], .counter-list > li")));
  }, []);
  return ref;
}
