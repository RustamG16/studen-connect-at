import { useLayoutEffect, useState } from "react";
import { bonuses, type Bonus, type Fact } from "@/data/bonuses";
import { storagePersists } from "@/lib/storageGuard";

/** The personal ledger (DESIGN.md, Gamification). Private by construction: nothing here ever leaves the browser. */
export const FACTS: { id: Fact; label: string }[] = [
  { id: "under24", label: "I'm under 24" },
  { id: "away", label: "I live away from my parents" },
  { id: "uniWien", label: "I study at Uni Wien" },
  { id: "need", label: "I have financial need" },
];

const KEY = "c4s.ledger.v1";
const STILL_KEY = "c4s.ledger.still";

// The session's copy, so routes agree when storage is blocked or full. No cross-tab sync, on purpose.
let session: Fact[] | null = null;
let still: boolean | null = null;
let stored = storagePersists;

/** Malformed or old values read as empty; the next change overwrites them. */
function parse(raw: string | null): Fact[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    const known = FACTS.map((fact) => fact.id as string);
    if (value?.v === 1 && Array.isArray(value.facts) && value.facts.every((fact: string) => known.includes(fact))) {
      return Array.from(new Set(value.facts as Fact[]));
    }
  } catch {
    // Falls through to empty.
  }
  return [];
}

function readFacts(): Fact[] {
  if (session) return session;
  try {
    session = parse(window.localStorage.getItem(KEY));
  } catch {
    stored = false;
    session = [];
  }
  return session;
}

function writeFacts(facts: Fact[]) {
  session = facts;
  try {
    if (facts.length) window.localStorage.setItem(KEY, JSON.stringify({ v: 1, facts }));
    else window.localStorage.removeItem(KEY);
    stored = storagePersists;
  } catch {
    stored = false;
  }
}

const stillListeners = new Set<() => void>();

/** The "Turn animations off" setting: read by the ledger and by every clip, so they share one answer. */
export function readStill(): boolean {
  if (still !== null) return still;
  try {
    still = window.localStorage.getItem(STILL_KEY) === "1";
  } catch {
    still = false;
  }
  return still;
}

export function subscribeStill(listener: () => void): () => void {
  stillListeners.add(listener);
  return () => stillListeners.delete(listener);
}

export function writeStill(next: boolean) {
  still = next;
  try {
    if (next) window.localStorage.setItem(STILL_KEY, "1");
    else window.localStorage.removeItem(STILL_KEY);
  } catch {
    // Holds for the session.
  }
  stillListeners.forEach((listener) => listener());
}

/** Rows in the order they were written, so a new line never moves the ones above it. Leistungsstipendium has no fact. */
export function writtenRows(facts: Fact[]): Bonus[] {
  return Array.from(new Set(facts.flatMap((fact) => bonuses.filter((bonus) => bonus.facts.includes(fact)))));
}

export function useLedger() {
  // Empty on the first render; storage is read after mount, before paint.
  const [facts, setFacts] = useState<Fact[]>([]);
  const [isStill, setIsStill] = useState(false);
  const [saved, setSaved] = useState(true);
  // Motion belongs to the visitor's own ticks. A restored ledger is simply there.
  const [ticked, setTicked] = useState(false);

  useLayoutEffect(() => {
    setFacts(readFacts());
    setIsStill(readStill());
    setSaved(stored);
    return subscribeStill(() => setIsStill(readStill()));
  }, []);

  const commit = (next: Fact[]) => {
    writeFacts(next);
    setFacts(next);
    setSaved(stored);
    setTicked(true);
  };

  const rows = writtenRows(facts);

  return {
    facts,
    rows,
    total: rows.reduce((sum, bonus) => sum + bonus.maxAmount, 0),
    saved,
    still: isStill,
    live: ticked && !isStill,
    toggle: (fact: Fact) => commit(facts.includes(fact) ? facts.filter((f) => f !== fact) : [...facts, fact]),
    clear: () => {
      commit([]);
      writeStill(false);
      setIsStill(false);
    },
  };
}

export type Ledger = ReturnType<typeof useLedger>;
