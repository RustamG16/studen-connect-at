import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ = () => {
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

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90">
            Find answers to common questions about using Care4Students
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-12">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="mb-6 text-2xl font-bold text-foreground">{category.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="rounded-lg border-2 px-6"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="gradient-subtle py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl border-2">
            <CardContent className="p-8 text-center">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Still Have Questions?
              </h2>
              <p className="mb-6 text-muted-foreground">
                Our support team is here to help! Contact us and we'll get back to you within 24
                hours.
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
