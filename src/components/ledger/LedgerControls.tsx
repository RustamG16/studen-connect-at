import { useEffect, useRef, useState } from "react";
import { FACTS, type Ledger } from "@/lib/ledger";
import { Tick } from "@/components/ledger/Tick";
import StillToggle from "@/components/ledger/StillToggle";

const ROLL_MS = 400;
const ANNOUNCE_MS = 500;

/** Rolls to the target over 400 ms and retargets from wherever it is if interrupted. Instant unless `animate`. */
function useRoll(target: number, animate: boolean): number {
  const [shown, setShown] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (!animate || from === target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      current.current = target;
      setShown(target);
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / ROLL_MS);
      current.current = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 4)));
      setShown(current.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [target, animate]);

  return shown;
}

const money = (n: number) => `€${n.toLocaleString("en-US")}`;

/**
 * "Up to €N" and its note, or the prompt while nothing is ticked. Both share one grid cell, so the swap moves nothing.
 * The digits are aria-hidden; the true string is in a polite live region, 500 ms after the last change.
 */
export const LedgerFigure = ({ ledger, ground }: { ledger: Ledger; ground: "deep" | "canvas" }) => {
  const { total, live } = ledger;
  const shown = useRoll(total, live);
  const text = total ? `Up to ${money(total)}` : "Tick what's true for you.";
  const [announced, setAnnounced] = useState("");
  const onDeep = ground === "deep";

  useEffect(() => {
    if (!live && !total) return;
    const timer = window.setTimeout(() => setAnnounced(text), live ? ANNOUNCE_MS : 0);
    return () => window.clearTimeout(timer);
  }, [text, live, total]);

  return (
    <div className="grid items-start [&>*]:[grid-area:1/1]">
      <p className={`t-lead self-center ${onDeep ? "text-on-deep-muted" : "text-ink-2"} ${total ? "invisible" : ""}`}>
        Tick what's true for you.
      </p>
      <div className={total ? "" : "invisible"}>
        <p
          aria-hidden="true"
          data-ledger-figure-own
          className={`t-row-amount whitespace-nowrap ${onDeep ? "text-warm" : "w-fit bg-warm p-4 text-warm-ink"}`}
        >
          Up to {money(shown)}
        </p>
        <p className={`t-meta mt-2 ${onDeep ? "text-on-deep-muted" : "text-ink-2"}`}>An estimate, not a promise.</p>
      </div>
      <p aria-live="polite" className="sr-only">
        {announced}
      </p>
    </div>
  );
};

/** The four facts as ruled rows, and the notes under them. Native checkboxes; the whole row is the label. */
export const LedgerToggles = ({ ledger, labelledBy }: { ledger: Ledger; labelledBy: string }) => {
  const { facts, toggle, clear, saved, live } = ledger;
  const group = useRef<HTMLDivElement>(null);

  // "Clear" leaves with the last tick, so it hands focus to the first toggle rather than dropping it on the body.
  const onClear = () => {
    clear();
    group.current?.querySelector("input")?.focus();
  };

  return (
    <div ref={group} role="group" aria-labelledby={labelledBy} {...(live ? { "data-ledger-live": "" } : {})}>
      <div className="ledger-toggles border-b">
        {FACTS.map((fact) => (
          <label key={fact.id} className="ledger-toggle row-rule">
            <span className="ledger-box">
              <input type="checkbox" checked={facts.includes(fact.id)} onChange={() => toggle(fact.id)} />
              <Tick />
            </span>
            <span>{fact.label}</span>
          </label>
        ))}
      </div>
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4">
        <p className={`t-meta ledger-note ${saved ? "" : "invisible"}`}>Saved only in this browser.</p>
        {facts.length ? (
          <button type="button" onClick={onClear} className="ledger-clear press">
            Clear
          </button>
        ) : null}
      </div>
      <StillToggle />
    </div>
  );
};
