import AuthCta from "@/components/AuthCta";
import { Button } from "@/components/ui/button";

/** The closing band on depth: flat, nothing scrubs, so it reads as a close. The one warm CTA on the page. */
const CtaBand = () => (
  <section data-ground="depth" className="clip-x bg-depth text-canvas" style={{ paddingBlock: "var(--section-y)" }}>
    <div className="shell-x">
      <h2 className="t-display mb-6 max-w-[16ch] !text-canvas">Ready to Transform Your Student Life?</h2>
      <p className="t-lead mb-8 max-w-[44ch]">
        Join thousands of Austrian students who are already benefiting from our platform.
      </p>
      <Button variant="warm" size="lg" asChild>
        <AuthCta>Start Your Journey</AuthCta>
      </Button>
    </div>
  </section>
);

export default CtaBand;
