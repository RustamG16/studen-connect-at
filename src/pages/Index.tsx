import { lazy, Suspense, useRef } from "react";
import PageShell from "@/components/PageShell";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Ledger from "@/components/home/Ledger";
import YourLedger from "@/components/home/YourLedger";
import Why from "@/components/home/Why";
import Quotes from "@/components/home/Quotes";
import CtaBand from "@/components/home/CtaBand";
import { useHomeReveals } from "@/components/home/useHomeReveals";

// If the chunk fails the page simply stays in its final state.
const HomeMotion = lazy(() => import("@/components/home/HomeMotion").catch(() => ({ default: () => null })));

const Index = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const loadMotion = useHomeReveals(rootRef);

  return (
    <div ref={rootRef}>
      <PageShell>
        <Hero />
        <Features />
        <Ledger />
        <YourLedger />
        <Why />
        <Quotes />
        <CtaBand />
      </PageShell>
      {loadMotion ? (
        <Suspense fallback={null}>
          <HomeMotion rootRef={rootRef} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Index;
