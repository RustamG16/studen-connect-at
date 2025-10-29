import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Banknote, Users, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import logo from "@/assets/dragonfly-logo.png";

const Index = () => {
  const features = [
    {
      icon: Banknote,
      title: "Student Bonuses",
      description: "Find and apply for all available Austrian student grants and bonuses",
    },
    {
      icon: Home,
      title: "Housing Support",
      description: "Get help finding student accommodation that fits your budget",
    },
    {
      icon: Users,
      title: "Roommate Matching",
      description: "Connect with compatible house buddies to share your student journey",
    },
    {
      icon: Sparkles,
      title: "Personalized Guidance",
      description: "Receive tailored support and resources for your unique situation",
    },
  ];

  const benefits = [
    "Save time with automated application tracking",
    "Never miss a funding deadline",
    "Connect with verified student housing",
    "Find your perfect roommate match",
    "Get expert support 24/7",
    "All services completely free",
  ];

  const testimonials = [
    {
      name: "Lisa M.",
      university: "TU Wien",
      text: "Care4Students helped me find €2,400 in bonuses I didn't know existed!",
    },
    {
      name: "Marco K.",
      university: "Uni Wien",
      text: "Found my perfect WG within two weeks. The roommate matching is amazing.",
    },
    {
      name: "Sarah T.",
      university: "WU Wien",
      text: "The support team walked me through every application step. So helpful!",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl">
                Funding. Housing. Support.
              </h1>
              <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
                Your complete platform for navigating student life in Austria. Find bonuses, secure
                housing, and connect with roommates – all in one place.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/bonuses">
                    Explore Bonuses <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link to="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src={logo}
                alt="Care4Students Dragonfly"
                className="h-64 w-64 animate-pulse md:h-80 md:w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive support for Austrian university students
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 transition-smooth hover:border-primary hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="gradient-subtle py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Why Students Choose Us
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-lg text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8" asChild>
                <Link to="/dashboard">Get Started Free</Link>
              </Button>
            </div>
            <div className="grid gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="mb-2 text-4xl font-bold text-primary">€2,400+</div>
                  <p className="text-muted-foreground">Average bonus value per student</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="mb-2 text-4xl font-bold text-primary">5,000+</div>
                  <p className="text-muted-foreground">Students supported</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="mb-2 text-4xl font-bold text-primary">2 weeks</div>
                  <p className="text-muted-foreground">Average time to find housing</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              What Students Say
            </h2>
            <p className="text-lg text-muted-foreground">Real stories from real students</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <p className="mb-4 text-muted-foreground">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.university}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Transform Your Student Life?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Join thousands of Austrian students who are already benefiting from our platform.
          </p>
          <Button variant="hero" size="lg" asChild className="bg-secondary hover:bg-secondary-light">
            <Link to="/contact">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
