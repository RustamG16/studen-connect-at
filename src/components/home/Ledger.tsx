import { Link } from "react-router-dom";
import AuthCta from "@/components/AuthCta";
import DragonflyMark from "@/components/brand/DragonflyMark";
import { Button } from "@/components/ui/button";
import { bonuses } from "@/data/bonuses";

/** "€5,040/year" rides as the figure and a small unit, so the digits keep their column. textContent is unchanged. */
const Amount = ({ amount }: { amount: string }) => {
  const i = amount.indexOf("/year");
  if (i < 0) return <>{amount}</>;
  return (
    <>
      {amount.slice(0, i)}
      <span className="amount-unit">{amount.slice(i)}</span>
    </>
  );
};

const [featured] = bonuses;
const [, symbol, digits, unit] = featured.amount.match(/^(€)([\d,]+)(.*)$/) ?? ["", "", featured.amount, ""];

/**
 * The Ledger on deep, at its resting end state: every row written, "Apply Now" on all six, the closing CTA in place.
 * The full-height stage exists (100dvh from 1024 px up) but nothing pins yet.
 */
const Ledger = () => (
  <section
    data-ground="deep"
    id="ledger"
    className="ledger-plate clip-x relative text-canvas lg:flex lg:min-h-[100dvh] lg:items-center"
    style={{ paddingBlock: "var(--section-y)" }}
  >
    <div className="shell-x w-full">
      <div className="grid gap-x-6 gap-y-8 md:grid-cols-12">
        <div className="flex flex-col gap-8 md:col-span-5 md:gap-12">
          <h2 className="t-display text-canvas">Available Bonuses</h2>

          {/* The figure at Ledger scale: Studienbeihilfe, the one grant with a documented amount in this frame. */}
          <div>
            <p aria-hidden="true" data-ledger-figure className="t-ledger-figure text-warm">
              <span data-count-prefix>{symbol}</span>
              <span data-count-digits>{digits}</span>
            </p>
            <p aria-hidden="true" data-ledger-line className="t-row-name mt-2 text-warm">
              {unit}
            </p>
            <h3 data-ledger-line className="t-row-name mt-6 !text-canvas">{featured.name}</h3>
            <p data-ledger-line className="mt-1 max-w-[34ch] text-on-deep-muted">{featured.description}</p>
          </div>
        </div>

        <div className="md:col-span-7">
          <ul className="border-b border-line-deep">
            {bonuses.map((bonus) => (
              <li key={bonus.id}>
                <AuthCta
                  data-ledger-row
                  className="ledger-row row-rule group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 [grid-template-areas:'amount_amount'_'name_apply'] lg:min-h-[clamp(56px,9svh,80px)] lg:grid-cols-[6em_minmax(0,1fr)_auto] lg:gap-x-6 lg:py-2 lg:[grid-template-areas:'amount_name_apply']"
                >
                  <span data-row-line className="t-row-name [grid-area:name]">{bonus.name}</span>
                  <span data-row-line className="t-row-amount [grid-area:amount]">
                    <Amount amount={bonus.amount} />
                  </span>
                  <span
                    data-row-apply
                    className="inline-flex min-h-11 items-center justify-end text-base font-bold underline decoration-1 underline-offset-4 [grid-area:apply]"
                  >
                    Apply Now
                  </span>
                </AuthCta>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between gap-6">
            <div data-ledger-cta>
              <Button variant="hero" asChild>
                <Link to="/bonuses">Explore Bonuses</Link>
              </Button>
            </div>
            <DragonflyMark data-ledger-mark strokeWidth={9} className="hidden h-20 w-20 shrink-0 text-mint md:block" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Ledger;
