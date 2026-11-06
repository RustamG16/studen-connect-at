import { useEffect, useRef, type ReactNode } from "react";
import { settleHero } from "@/components/home/useHomeReveals";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
  /** A framed banner (HeaderBanner): stacked after the text, or in the right five columns from 1280 px. */
  media?: ReactNode;
}

/** Subpage head: eyebrow, h1 with the hero's settle (beat 1), lead, optional CTA, then the rule that draws. */
const PageHeader = ({ eyebrow, title, lead, children, media }: PageHeaderProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return settleHero(el);
  }, []);

  return (
    <header ref={ref} data-settle="wait" className="clip-x">
      <div className="shell-x pb-8 pt-8 md:pb-14 md:pt-16">
        <div className={media ? "xl:grid xl:grid-cols-12 xl:items-end xl:gap-x-6" : undefined}>
          <div className={media ? "xl:col-span-7" : undefined}>
            <p className="t-eyebrow mb-4 text-ink-2">{eyebrow}</p>
            <h1 data-hero-word className="t-page-h1 max-w-[18ch] pb-[0.08em]">
              {title}
            </h1>
            {lead ? <p className="t-lead mt-5 max-w-[46ch] text-ink-2 md:mt-7">{lead}</p> : null}
            {children ? <div className="mt-6 md:mt-8">{children}</div> : null}
          </div>
          {media}
        </div>
      </div>
      <div data-stat-rule className="h-px origin-left bg-line" />
    </header>
  );
};

export default PageHeader;
