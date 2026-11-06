import { Button } from "@/components/ui/button";
import AuthCta from "@/components/AuthCta";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import HeaderBanner from "@/components/media/HeaderBanner";
import ClosingBand from "@/components/page/ClosingBand";
import { usePageRows } from "@/components/page/usePageRows";

const openGroups = [
  {
    id: 1,
    name: "Lisa & Maria",
    looking: "1 more person",
    budget: "€400-500/month",
    location: "9th-18th District",
    interests: ["Coffee lover", "Early bird", "Non-smoker"],
    description: "Two TU Wien students looking for a tidy, friendly third roommate.",
  },
  {
    id: 2,
    name: "Marco's Group",
    looking: "2 more people",
    budget: "€350-450/month",
    location: "2nd-3rd District",
    interests: ["Night owl", "Music lover", "Cook together"],
    description: "UniWien student seeking roommates who love cooking and music.",
  },
  {
    id: 3,
    name: "International Squad",
    looking: "1 more person",
    budget: "€450-600/month",
    location: "City center",
    interests: ["Travel", "Languages", "Social"],
    description: "Three international students looking for an open-minded fourth member.",
  },
  {
    id: 4,
    name: "Study-Focused Duo",
    looking: "2 more people",
    budget: "€400-500/month",
    location: "Near TU Wien",
    interests: ["Quiet", "Organized", "Gym"],
    description: "Serious students seeking focused, respectful roommates.",
  },
];

const features = [
  {
    title: "Personality Matching",
    description: "We match you based on lifestyle, habits, and study schedules",
  },
  {
    title: "Shared Interests",
    description: "Find roommates who share your hobbies and daily routines",
  },
  {
    title: "Study Compatibility",
    description: "Connect with students who have similar study habits",
  },
  {
    title: "Group Chat",
    description: "Chat with potential roommates before committing",
  },
];


const joinItems = ["Verified student profiles", "Safe & secure matching", "Compatibility scores", "Free forever"];

const FindBuddy = () => {
  const rows = usePageRows();

  return (
    <PageShell>
      <PageHeader
        media={<HeaderBanner name="find-buddy" stillToggle />}
        eyebrow="Find Buddy"
        title={
          <>
            Find Your House <em className="t-serif -mx-[0.08em] px-[0.08em]">Buddy</em>
          </>
        }
        lead="Looking for the perfect roommate? Join or create a group to find compatible house buddies who share your lifestyle and values."
      >
        <Button size="lg" asChild>
          <AuthCta>Create Your Profile</AuthCta>
        </Button>
      </PageHeader>

      <div ref={rows}>
        <section className="clip-x" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x">
            <div className="mb-8 md:mb-12">
              <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">How Roommate Matching Works</h2>
              <p className="t-lead max-w-[46ch] text-ink-2">Find your perfect living situation in 4 easy steps</p>
            </div>
            <ol className="counter-list border-b">
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="row-rule grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-5 text-ink-2 md:grid-cols-12 md:gap-x-6 md:py-7"
                >
                  <h3 className="col-start-2 text-xl font-bold leading-tight text-foreground md:col-span-5 md:col-start-2 md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="col-start-2 mt-1 md:col-span-6 md:col-start-7 md:mt-0">{feature.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="clip-x rule" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x">
            <div className="mb-8 md:mb-12">
              <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Open Groups</h2>
              <p className="t-lead max-w-[46ch] text-ink-2">
                These groups are actively looking for new roommates (create account to contact them)
              </p>
            </div>

            <ul className="border-b">
              {openGroups.map((group, i) => (
                <li
                  key={group.id}
                  data-rule-row
                  style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
                  className="row-rule grid gap-x-6 gap-y-3 py-6 md:grid-cols-12 md:py-9"
                >
                  <div className="md:col-span-4 lg:col-span-3">
                    <h3 className="t-row-amount mb-1 text-[clamp(1.5rem,6.5vw,2rem)]">{group.name}</h3>
                    <p className="t-meta tnum font-bold">{group.looking}</p>
                  </div>
                  <div className="md:col-span-5 lg:col-span-6">
                    <p className="mb-3 max-w-[56ch] text-ink-2">{group.description}</p>
                    <p className="t-meta tnum mb-1 text-ink-2">
                      <span className="font-bold text-foreground">Budget: </span>
                      <span>{group.budget}</span>
                    </p>
                    <p className="t-meta mb-3 text-ink-2">{group.location}</p>
                    <ul className="tag-rules t-meta text-ink-2">
                      {group.interests.map((interest) => (
                        <li key={interest}>{interest}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex md:col-span-3 md:justify-end">
                    <Button variant="outline" asChild className="w-full md:w-auto">
                      <AuthCta>View Profile</AuthCta>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 md:mt-12">
              <Button size="lg" asChild>
                <AuthCta>Browse All Groups</AuthCta>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ClosingBand
        title="Can't Find the Right Group?"
        action={
          <Button variant="warm" size="lg" asChild>
            <AuthCta>Create Your Group</AuthCta>
          </Button>
        }
        aside={
          <div>
            <h3 className="mb-3 text-2xl font-bold !text-canvas md:text-3xl">Join 1,200+ Students</h3>
            <p className="mb-6 text-on-deep-muted">Already using House Buddy to find their perfect roommates</p>
            <ul className="border-b border-line-deep">
              {joinItems.map((item) => (
                <li key={item} className="border-t border-line-deep py-3 text-canvas">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        Create your own roommate search profile! Tell us about yourself, your preferences, and what you're looking for.
        We'll match you with compatible students and help you form your perfect WG.
      </ClosingBand>
    </PageShell>
  );
};

export default FindBuddy;
