import { Button } from "@/components/ui/button";
import AuthCta from "@/components/AuthCta";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import HeaderBanner from "@/components/media/HeaderBanner";
import ClosingBand from "@/components/page/ClosingBand";
import Amount from "@/components/page/Amount";
import { usePageRows } from "@/components/page/usePageRows";
import { LedgerFigure, LedgerToggles } from "@/components/ledger/LedgerControls";
import { Tick } from "@/components/ledger/Tick";
import { bonuses } from "@/data/bonuses";
import { useLedger } from "@/lib/ledger";

const Bonuses = () => {
  const rows = usePageRows();
  const ledger = useLedger();
  const written = ledger.rows.map((bonus) => bonus.id);

  return (
    <PageShell>
      <PageHeader
        media={<HeaderBanner name="bonuses" />}
        eyebrow="Bonuses"
        title={
          <>
            Student <em className="t-serif -mx-[0.08em] px-[0.08em]">Bonuses</em> & Grants
          </>
        }
        lead="Discover all available funding opportunities for Austrian students. We help you find and apply for every bonus you're eligible for."
      >
        <Button size="lg" asChild>
          <AuthCta>Start Your Application</AuthCta>
        </Button>
      </PageHeader>

      {/* Toggles and figure only: the rows below are the ledger. */}
      <section aria-labelledby="your-ledger-label" className="clip-x border-b pb-8 pt-8 md:pb-12 md:pt-12">
        <div className="shell-x grid gap-x-6 gap-y-6 md:grid-cols-12">
          <p id="your-ledger-label" className="t-eyebrow text-ink-2 md:col-span-12">Your ledger</p>
          <div className="md:order-2 md:col-span-5 md:col-start-8">
            <LedgerFigure ledger={ledger} ground="canvas" />
          </div>
          <div className="md:order-1 md:col-span-6">
            <LedgerToggles ledger={ledger} labelledBy="your-ledger-label" />
          </div>
        </div>
      </section>

      <section ref={rows} className="clip-x" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="shell-x">
          <div className="mb-8 md:mb-12">
            <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Available Bonuses</h2>
            <p className="t-lead max-w-[46ch] text-ink-2">
              Browse through all funding opportunities and see which ones match your profile
            </p>
          </div>

          <ul className="border-b" {...(ledger.live ? { "data-ledger-live": "" } : {})}>
            {bonuses.map((bonus, i) => (
              <li
                key={bonus.id}
                data-rule-row
                style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
                className="row-rule grid gap-x-6 gap-y-3 py-6 md:grid-cols-12 md:py-9"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 md:col-span-4 md:block lg:col-span-3">
                  <p className="t-row-amount tnum">
                    <Amount value={bonus.amount} />
                  </p>
                  {bonus.facts.length ? (
                    <p data-on={written.includes(bonus.id)} className="ledger-mark t-meta md:mt-3">
                      <span className="ledger-box ledger-box-mark">
                        <Tick />
                      </span>
                      In your ledger
                    </p>
                  ) : null}
                </div>

                <div className="md:col-span-5 lg:col-span-6">
                  <h3 className="t-row-name mb-1 text-xl md:text-2xl">{bonus.name}</h3>
                  <p className="mb-3 max-w-[56ch] text-ink-2">{bonus.description}</p>
                  <p className="t-meta tnum mb-1 text-ink-2">
                    <span>Deadline: {bonus.deadline}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="inline-block">Eligible: {bonus.eligibility}</span>
                  </p>
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
                      <span className="underline underline-offset-4">Requirements:</span>
                      <span aria-hidden="true" className="fold-sign relative h-2.5 w-2.5" />
                    </summary>
                    <ul className="t-meta max-w-[56ch] pb-2 text-ink-2">
                      {bonus.requirements.map((req) => (
                        <li key={req} className="py-1">
                          <span aria-hidden="true">• </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                <div className="flex md:col-span-3 md:justify-end lg:col-span-3">
                  <Button asChild className="w-full md:w-auto">
                    <AuthCta>Apply Now</AuthCta>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingBand
        title="Not Sure Which Bonuses You Qualify For?"
        action={
          <Button variant="warm" size="lg" asChild>
            <AuthCta>Get Personalized Matches</AuthCta>
          </Button>
        }
      >
        Create your profile and we'll automatically match you with all eligible funding opportunities.
      </ClosingBand>
    </PageShell>
  );
};

export default Bonuses;
