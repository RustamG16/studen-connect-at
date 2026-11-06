import AuthCta from "@/components/AuthCta";
import Amount from "@/components/page/Amount";
import { LedgerFigure, LedgerToggles } from "@/components/ledger/LedgerControls";
import { Button } from "@/components/ui/button";
import { bonuses } from "@/data/bonuses";
import { useLedger } from "@/lib/ledger";

// All five rows that can be written stay mounted: from 768 px the unwritten ones reserve their slots, so nothing below moves.
const writable = bonuses.filter((bonus) => bonus.facts.length);

/** Beat 5, continuing on deep: toggles left, written rows right; stacked on phones. */
const YourLedger = () => {
  const ledger = useLedger();
  const written = ledger.rows.map((bonus) => bonus.id);

  return (
    <section
      data-ground="deep"
      id="your-ledger"
      aria-labelledby="your-ledger-title"
      className="ledger-plate rule-deep clip-x relative text-canvas"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div className="shell-x w-full">
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 id="your-ledger-title" className="t-display mb-6 text-canvas md:mb-8">Your ledger</h2>
            <div className="mb-6 md:mb-8">
              <LedgerFigure ledger={ledger} ground="deep" />
            </div>
            <LedgerToggles ledger={ledger} labelledBy="your-ledger-title" />
          </div>

          <div className="md:col-span-7">
            <ul className="written-rows" {...(ledger.live ? { "data-ledger-live": "" } : {})}>
              {writable.map((bonus) => {
                const at = written.indexOf(bonus.id);
                return (
                  <li
                    key={bonus.id}
                    data-written={at >= 0}
                    aria-hidden={at >= 0 ? undefined : true}
                    style={{ order: at >= 0 ? at : writable.length }}
                    className="written-row row-rule"
                  >
                    <span className="t-row-amount">
                      <Amount value={bonus.amount} />
                    </span>
                    <span className="t-row-name">{bonus.name}</span>
                  </li>
                );
              })}
            </ul>

            <Button variant="hero" size="lg" className="mt-8" asChild>
              <AuthCta>Create Your Free Profile</AuthCta>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YourLedger;
