import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/button";
import AuthCta from "@/components/AuthCta";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import HeaderBanner from "@/components/media/HeaderBanner";
import ClosingBand from "@/components/page/ClosingBand";
import Fold from "@/components/page/Fold";
import { usePageRows } from "@/components/page/usePageRows";
import MediaLoop from "@/components/media/MediaLoop";

const steps = [
  {
    title: "Create Your Profile",
    description:
      "Sign up and tell us about your situation - study status, income, housing needs, and preferences.",
    time: "2 minutes",
    card: "how-profile",
  },
  {
    title: "Get Matched",
    description:
      "Our system analyzes your profile and finds all bonuses, housing options, and potential roommates that match you.",
    time: "Instant",
    card: "how-matched",
  },
  {
    title: "Upload Documents",
    description:
      "Securely upload your required documents. We guide you through exactly what you need for each application.",
    time: "5-10 minutes",
    card: "how-documents",
  },
  {
    title: "Receive Support",
    description:
      "Track your applications, get expert help, and receive notifications about your bonuses and housing matches.",
    time: "Ongoing",
    card: "how-support",
  },
];

const features = [
  {
    title: "For Bonuses",
    items: [
      "Automatic eligibility checking",
      "Deadline reminders",
      "Document checklist",
      "Application tracking",
      "Expert support",
    ],
  },
  {
    title: "For Housing",
    items: [
      "Budget and location preferences",
      "Verified student housing",
      "Direct landlord contact",
      "Viewing scheduling",
      "Contract support",
    ],
  },
  {
    title: "For Roommates",
    items: [
      "Personality matching",
      "Lifestyle preferences",
      "Study schedule compatibility",
      "Group chat features",
      "Safe verification",
    ],
  },
];


const HowItWorks = () => {
  const rows = usePageRows();

  return (
    <PageShell>
      <PageHeader
        media={<HeaderBanner name="how-it-works" stillToggle />}
        eyebrow="Guide"
        title="How Care4Students Works"
        lead="Getting support for your student life has never been easier. Follow these simple steps to unlock all available opportunities."
      />

      <div ref={rows}>
        <section className="clip-x" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x">
            <ol className="counter-list border-b">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="row-rule grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-12 md:gap-x-6 md:py-9"
                >
                  <h2 className="col-start-2 text-2xl font-bold leading-tight text-foreground md:col-span-3 md:col-start-2 md:row-start-1 md:text-3xl">
                    {step.title}
                  </h2>
                  <p className="t-stat tnum col-start-2 text-primary-text md:col-span-2 md:col-start-9 md:row-start-1 md:text-right">
                    {step.time}
                  </p>
                  <p className="col-start-2 max-w-[52ch] text-ink-2 md:col-span-4 md:col-start-5 md:row-start-1 md:max-w-none">
                    {step.description}
                  </p>
                  <MediaLoop
                    src={asset(`/media/cards/${step.card}`)}
                    width={480}
                    height={360}
                    maxWidth={240}
                    mode="once"
                    index={i}
                    className="col-start-3 row-span-3 row-start-1 hidden w-24 self-center min-[360px]:block md:col-span-2 md:col-start-11 md:row-span-1 md:w-auto md:self-start"
                  />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="clip-x rule" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x">
            <div className="mb-8 md:mb-12">
              <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">What You Get With Each Service</h2>
              <p className="t-lead max-w-[46ch] text-ink-2">Comprehensive support across all aspects of student life</p>
            </div>
            <div className="grid gap-x-6 md:grid-cols-3">
              {features.map((feature) => (
                <Fold key={feature.title} summary={<h3 className="inline text-lg font-bold md:text-2xl">{feature.title}</h3>} openFrom={768}>
                  <ul className="pb-4 md:pb-8">
                    {feature.items.map((item) => (
                      <li key={item} className="border-t py-3 text-ink-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Fold>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ClosingBand
        title="Ready to Get Started?"
        action={
          <Button variant="warm" size="lg" asChild>
            <AuthCta>Create Your Free Profile</AuthCta>
          </Button>
        }
      >
        Join thousands of students who are already benefiting from our platform.
      </ClosingBand>
    </PageShell>
  );
};

export default HowItWorks;
