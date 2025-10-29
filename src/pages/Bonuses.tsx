import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Euro, Calendar, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Bonuses = () => {
  const bonuses = [
    {
      id: 1,
      name: "Studienbeihilfe",
      amount: "€5,040/year",
      deadline: "December 15, 2025",
      eligibility: "All students",
      description: "Austria's main student grant for those with financial need",
      requirements: ["Income proof", "Study confirmation", "Residence permit"],
    },
    {
      id: 2,
      name: "Wohnbeihilfe",
      amount: "€3,600/year",
      deadline: "Ongoing",
      eligibility: "Students with housing costs",
      description: "Housing subsidy for students living away from parents",
      requirements: ["Rental contract", "Income declaration", "Study enrollment"],
    },
    {
      id: 3,
      name: "Familienbeihilfe",
      amount: "€1,476/year",
      deadline: "Ongoing",
      eligibility: "Students under 24",
      description: "Family allowance for students in tertiary education",
      requirements: ["Age verification", "Study progress", "Austrian residence"],
    },
    {
      id: 4,
      name: "Stipendium der Universität Wien",
      amount: "€7,200/year",
      deadline: "March 31, 2025",
      eligibility: "Uni Wien students",
      description: "Merit-based scholarship for outstanding academic performance",
      requirements: ["GPA 1.5 or better", "Recommendation letters", "Application essay"],
    },
    {
      id: 5,
      name: "ÖH Sozialfonds",
      amount: "€500-2,000",
      deadline: "Quarterly",
      eligibility: "Students in hardship",
      description: "Emergency fund for students facing financial difficulties",
      requirements: ["Financial proof", "Personal statement", "ÖH membership"],
    },
    {
      id: 6,
      name: "Leistungsstipendium",
      amount: "€750-1,500",
      deadline: "May 1, 2025",
      eligibility: "High achievers",
      description: "Performance scholarship for academic excellence",
      requirements: ["Minimum GPA 1.0", "Study progress", "Application form"],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Student Bonuses & Grants
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Discover all available funding opportunities for Austrian students. We help you find
            and apply for every bonus you're eligible for.
          </p>
          <Button variant="hero" size="lg" asChild className="bg-secondary hover:bg-secondary-light">
            <Link to="/dashboard">Start Your Application</Link>
          </Button>
        </div>
      </section>

      {/* Bonuses List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Available Bonuses</h2>
            <p className="text-muted-foreground">
              Browse through all funding opportunities and see which ones match your profile
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {bonuses.map((bonus) => (
              <Card key={bonus.id} className="border-2 transition-smooth hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-2xl">{bonus.name}</CardTitle>
                    <Badge className="bg-primary text-primary-foreground">{bonus.amount}</Badge>
                  </div>
                  <p className="text-muted-foreground">{bonus.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Deadline: {bonus.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Eligible: {bonus.eligibility}</span>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-foreground">Requirements:</p>
                    <ul className="space-y-1">
                      {bonus.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/dashboard">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-subtle py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <Euro className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Not Sure Which Bonuses You Qualify For?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Create your profile and we'll automatically match you with all eligible funding
              opportunities.
            </p>
            <Button size="lg" asChild>
              <Link to="/dashboard">Get Personalized Matches</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Bonuses;
