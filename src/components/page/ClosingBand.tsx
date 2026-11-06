import type { ReactNode } from "react";

interface ClosingBandProps {
  title: string;
  children?: ReactNode;
  action: ReactNode;
  aside?: ReactNode;
}

/** The page's closing band on depth: flat, no motion. Its action is the page's one warm CTA. */
const ClosingBand = ({ title, children, action, aside }: ClosingBandProps) => (
  <section data-ground="depth" className="clip-x bg-depth text-canvas" style={{ paddingBlock: "var(--section-y)" }}>
    <div className="shell-x grid gap-10 md:grid-cols-12 md:gap-x-6">
      <div className={aside ? "md:col-span-6" : "md:col-span-9"}>
        <h2 className="t-display mb-6 max-w-[16ch] !text-canvas">{title}</h2>
        {children ? <p className="t-lead mb-8 max-w-[44ch]">{children}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row">{action}</div>
      </div>
      {aside ? <div className="md:col-span-5 md:col-start-8">{aside}</div> : null}
    </div>
  </section>
);

export default ClosingBand;
