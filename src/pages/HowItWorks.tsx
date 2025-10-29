import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, FileSearch, Upload, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Sign up and tell us about your situation - study status, income, housing needs, and preferences.",
      time: "2 minutes",
    },
    {
      icon: FileSearch,
      title: "Get Matched",
      description:
        "Our system analyzes your profile and finds all bonuses, housing options, and potential roommates that match you.",
      time: "Instant",
    },
    {
      icon: Upload,
      title: "Upload Documents",
      description:
        "Securely upload your required documents. We guide you through exactly what you need for each application.",
      time: "5-10 minutes",
    },
    {
      icon: CheckCircle,
      title: "Receive Support",
      description:
        "Track your applications, get expert help, and receive notifications about your bonuses and housing matches.",
      time: "Ongoing",
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

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            How Care4Students Works
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90">
            Getting support for your student life has never been easier. Follow these simple steps
            to unlock all available opportunities.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="grid items-center gap-8 lg:grid-cols-2"
                style={{
                  flexDirection: index % 2 === 1 ? "row-reverse" : "row",
                }}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="rounded-lg bg-primary/10 px-4 py-2">
                      <span className="text-sm font-semibold text-primary">{step.time}</span>
                    </div>
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-foreground">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground">{step.description}</p>
                </div>
                <Card className={`border-2 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <CardContent className="flex h-64 items-center justify-center p-8">
                    <step.icon className="h-32 w-32 text-primary/20" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Breakdown */}
      <section className="gradient-subtle py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              What You Get With Each Service
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive support across all aspects of student life
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 transition-smooth hover:border-primary">
                <CardContent className="p-8">
                  <h3 className="mb-6 text-2xl font-bold text-foreground">{feature.title}</h3>
                  <ul className="space-y-3">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Join thousands of students who are already benefiting from our platform.
          </p>
          <Button variant="hero" size="lg" asChild className="bg-secondary hover:bg-secondary-light">
            <Link to="/dashboard">
              Create Your Free Profile <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
