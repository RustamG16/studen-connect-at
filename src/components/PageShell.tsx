import { useEffect, type ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/** Nav, main landmark and footer for every public route. The routes' own content sits in `children`. */
const PageShell = ({ children, className }: PageShellProps) => {
  // Print shows every fold open, then puts each back as it was.
  useEffect(() => {
    let opened: HTMLDetailsElement[] = [];
    const before = () => {
      opened = Array.from(document.querySelectorAll<HTMLDetailsElement>("details:not([open])"));
      opened.forEach((el) => (el.open = true));
    };
    const after = () => {
      opened.forEach((el) => (el.open = false));
      opened = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);

  return (
    <div className="flex min-h-[100svh] flex-col bg-background text-foreground">
      <Navbar />
      <main id="main" className={`flex-1 ${className ?? ""}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageShell;
