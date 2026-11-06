import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import { usePageRows } from "@/components/page/usePageRows";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is Care4Students?",
        a: "Care4Students is a comprehensive platform helping Austrian university students find bonuses, secure housing, and connect with roommates. We simplify the student support process by providing personalized matching and expert guidance.",
      },
      {
        q: "Is Care4Students really free?",
        a: "Yes! All our core services are completely free for students. We believe every student deserves access to support and funding opportunities without financial barriers.",
      },
      {
        q: "Which universities do you support?",
        a: "We support all universities in Austria, including TU Wien, Universität Wien, WU Wien, and many others. Our services are available to any student enrolled in an Austrian higher education institution.",
      },
    ],
  },
  {
    category: "Bonuses & Grants",
    questions: [
      {
        q: "How do I know which bonuses I'm eligible for?",
        a: "Once you create your profile and enter your information (income, study status, age, etc.), our system automatically matches you with all bonuses you qualify for. You'll see your personalized list in your dashboard.",
      },
      {
        q: "When are bonus applications due?",
        a: "Deadlines vary by bonus. Some are ongoing (like Familienbeihilfe), while others have specific dates. We send you reminders for all your relevant deadlines so you never miss an opportunity.",
      },
      {
        q: "What documents do I need for applications?",
        a: "Required documents vary, but commonly include: proof of enrollment, income statements, rental contracts, and ID documents. We provide a personalized checklist for each bonus you're applying for.",
      },
      {
        q: "How long does it take to receive bonuses?",
        a: "Processing times vary by organization. Studienbeihilfe typically takes 6-8 weeks, while Familienbeihilfe can be faster. We help you track your application status.",
      },
    ],
  },
  {
    category: "Housing",
    questions: [
      {
        q: "Are all housing listings verified?",
        a: "Yes! We verify all landlords and listings to ensure they're legitimate. We check ownership documents and conduct basic screening to protect students from scams.",
      },
      {
        q: "What's the average rent in Vienna?",
        a: "Student rooms typically range from €350-550/month in shared flats (WG), €600-900 for studios, and €300-450 in student dorms. Prices vary by district and amenities.",
      },
      {
        q: "Can you help with rental contracts?",
        a: "Yes! We provide guidance on reviewing rental contracts and can connect you with legal advisors if needed. We want to ensure you understand all terms before signing.",
      },
    ],
  },
  {
    category: "House Buddy (Roommate Matching)",
    questions: [
      {
        q: "How does roommate matching work?",
        a: "You create a profile with your preferences, habits, and lifestyle. Our algorithm matches you with compatible students based on factors like sleep schedule, cleanliness, social preferences, and study habits.",
      },
      {
        q: "Can I see profiles before matching?",
        a: "Yes! You can browse open groups and individual profiles. Once matched, you can chat with potential roommates before making any commitments.",
      },
      {
        q: "What if the match doesn't work out?",
        a: "You're not obligated to move in with anyone. Use our chat feature to get to know potential roommates first. We recommend meeting in person (in a safe place) before making decisions.",
      },
    ],
  },
];


const FAQ = () => {
  const rows = usePageRows();

  return (
    <PageShell>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        lead="Find answers to common questions about using Care4Students"
      />

      <section ref={rows} className="clip-x" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="shell-x">
          {faqs.map((category, categoryIndex) => (
            <div key={category.category} className="grid gap-x-6 gap-y-4 pb-10 md:grid-cols-12 md:pb-16">
              <h2 className="text-2xl font-extrabold leading-tight md:col-span-4 md:text-3xl">{category.category}</h2>
              <Accordion type="single" collapsible className="md:col-span-8">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={item.q}
                    value={`${categoryIndex}-${index}`}
                    data-rule-row
                    className="row-rule border-b-0 last:border-b last:border-line"
                  >
                    <AccordionTrigger className="text-left text-lg font-bold text-foreground hover:underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-[68ch] text-ink-2">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      <section className="clip-x rule" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="shell-x grid gap-x-6 gap-y-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Still Have Questions?</h2>
            <p className="t-lead max-w-[46ch] text-ink-2">
              Our support team is here to help! Contact us and we'll get back to you within 24 hours.
            </p>
          </div>
          <div className="md:col-span-4 md:flex md:justify-end">
            <Button size="lg" asChild className="w-full md:w-auto">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default FAQ;
