import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Coffee, BookOpen, Music, Dumbbell, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FindBuddy = () => {
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
      icon: Heart,
      title: "Personality Matching",
      description: "We match you based on lifestyle, habits, and study schedules",
    },
    {
      icon: Coffee,
      title: "Shared Interests",
      description: "Find roommates who share your hobbies and daily routines",
    },
    {
      icon: BookOpen,
      title: "Study Compatibility",
      description: "Connect with students who have similar study habits",
    },
    {
      icon: Users,
      title: "Group Chat",
      description: "Chat with potential roommates before committing",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Find Your House Buddy
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Looking for the perfect roommate? Join or create a group to find compatible house
            buddies who share your lifestyle and values.
          </p>
          <Button variant="hero" size="lg" asChild className="bg-secondary hover:bg-secondary-light">
            <Link to="/dashboard">Create Your Profile</Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">How Roommate Matching Works</h2>
            <p className="text-muted-foreground">Find your perfect living situation in 4 easy steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 text-center transition-smooth hover:border-primary">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Groups */}
      <section className="gradient-subtle py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Open Groups</h2>
            <p className="text-muted-foreground">
              These groups are actively looking for new roommates (create account to contact them)
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {openGroups.map((group) => (
              <Card key={group.id} className="border-2 transition-smooth hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <Badge className="bg-primary text-primary-foreground">{group.looking}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{group.location}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{group.description}</p>
                  <div>
                    <span className="font-semibold text-foreground">Budget: </span>
                    <span className="text-muted-foreground">{group.budget}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/dashboard">
                      View Profile <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/dashboard">Browse All Groups</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Can't Find the Right Group?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Create your own roommate search profile! Tell us about yourself, your preferences,
                and what you're looking for. We'll match you with compatible students and help you
                form your perfect WG.
              </p>
              <Button size="lg" asChild>
                <Link to="/dashboard">Create Your Group</Link>
              </Button>
            </div>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-8">
                <Users className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  Join 1,200+ Students
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Already using House Buddy to find their perfect roommates
                </p>
                <ul className="space-y-2">
                  {[
                    "Verified student profiles",
                    "Safe & secure matching",
                    "Compatibility scores",
                    "Free forever",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FindBuddy;
