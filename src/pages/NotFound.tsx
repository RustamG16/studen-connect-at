import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import DragonflyMark from "@/components/brand/DragonflyMark";

const NotFound = () => {
  return (
    <PageShell>
      <section className="clip-x">
        <div className="shell-x flex items-end justify-between gap-6 pb-8 pt-8 md:pb-10 md:pt-14">
          <h1 className="t-hero tnum">404</h1>
          {/* M7: the mark draws itself once, in 1.2 s; reduced motion gets it drawn (the loader's own CSS). */}
          <DragonflyMark
            className="loader-mark mb-[0.1em] h-24 w-24 shrink-0 text-depth md:h-40 md:w-40"
            style={{ "--draw-ms": "1200ms" } as React.CSSProperties}
          />
        </div>
        <div className="h-px bg-line" />
        <div className="shell-x py-8 md:py-12">
          <p className="t-lead mb-6 text-ink-2">Oops! Page not found</p>
          <Button size="lg" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
};

export default NotFound;
