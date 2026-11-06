import { useEffect, useState, type ReactNode } from "react";

interface FoldProps {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Open and not collapsible from this width (px) up: a fold on phones, a plain column on desktop. */
  openFrom?: number;
  className?: string;
}

/** A native `<details>` fold on ruled paper. The summary is a ≥ 56 px row. */
const Fold = ({ summary, children, defaultOpen, openFrom, className }: FoldProps) => {
  const query = openFrom ? `(min-width: ${openFrom}px)` : null;
  const [wide, setWide] = useState(() => (query ? window.matchMedia(query).matches : false));

  useEffect(() => {
    if (!query) return;
    const mq = window.matchMedia(query);
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return (
    <details
      className={`fold group ${className ?? ""}`}
      open={wide || defaultOpen ? true : undefined}
      onToggle={(event) => {
        if (wide && !event.currentTarget.open) event.currentTarget.open = true;
      }}
    >
      <summary
        className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-bold [&::-webkit-details-marker]:hidden ${
          openFrom ? "md:pointer-events-none md:cursor-default" : ""
        }`}
      >
        <span>{summary}</span>
        <span
          aria-hidden="true"
          className={`fold-sign relative h-3 w-3 shrink-0 ${openFrom ? "md:hidden" : ""}`}
        />
      </summary>
      {children}
    </details>
  );
};

export default Fold;
