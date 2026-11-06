import { useSyncExternalStore } from "react";
import { Tick } from "@/components/ledger/Tick";
import { readStill, subscribeStill, writeStill } from "@/lib/ledger";

/**
 * "Turn animations off" (N14): the one control for every moving thing a visitor did not start. It stops the ledger's
 * motion and every banner or card clip, on any route, and shares one key (`c4s.ledger.still`) with the ledger.
 */
const StillToggle = () => {
  const still = useSyncExternalStore(subscribeStill, readStill, () => false);

  return (
    <label className="t-meta ledger-note flex min-h-11 cursor-pointer items-center gap-3">
      <span className="ledger-box ledger-box-small">
        <input type="checkbox" checked={still} onChange={(event) => writeStill(event.target.checked)} />
        <Tick />
      </span>
      <span>Turn animations off</span>
    </label>
  );
};

export default StillToggle;
