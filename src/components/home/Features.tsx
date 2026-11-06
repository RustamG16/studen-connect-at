import { asset } from "@/lib/asset";
import MediaLoop from "@/components/media/MediaLoop";

const features = [
  {
    title: "Student Bonuses",
    card: "home-bonuses",
    description: "Find and apply for all available Austrian student grants and bonuses",
  },
  {
    title: "Housing Support",
    card: "home-housing",
    description: "Get help finding student accommodation that fits your budget",
  },
  {
    title: "Roommate Matching",
    card: "home-roommates",
    description: "Connect with compatible house buddies to share your student journey",
  },
  {
    title: "Personalized Guidance",
    card: "home-guidance",
    description: "Receive tailored support and resources for your unique situation",
  },
];

/** "Everything You Need": the four services as a numbered ledger list. The numbers are CSS counters. */
const Features = () => (
  <section className="rule clip-x" style={{ paddingBlock: "var(--section-y)" }}>
    <div className="shell-x">
      <div className="mb-8 md:mb-12">
        <h2 className="t-display mb-4">
          Everything You{" "}
          <em className="t-serif -mx-[0.08em] px-[0.08em]">Need</em>
        </h2>
        <p className="t-lead text-ink-2">Comprehensive support for Austrian university students</p>
      </div>

      <ol className="counter-list border-b">
        {features.map((feature, i) => (
          <li
            key={feature.title}
            className="row-rule grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-5 text-ink-2 md:grid-cols-12 md:gap-x-6 md:py-7"
          >
            <h3 className="col-start-2 text-xl font-bold leading-tight text-foreground md:col-span-4 md:col-start-2 md:text-2xl">
              {feature.title}
            </h3>
            <p className="col-start-2 mt-1 md:col-span-5 md:col-start-6 md:mt-0">{feature.description}</p>
            <MediaLoop
              src={asset(`/media/cards/${feature.card}`)}
              width={480}
              height={360}
              maxWidth={240}
              mode="once"
              index={i}
              className="col-start-3 row-span-2 row-start-1 hidden w-24 self-center min-[360px]:block md:col-span-2 md:col-start-11 md:row-span-1 md:w-auto md:self-start"
            />
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Features;
