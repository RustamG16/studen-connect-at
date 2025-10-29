import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Euro, Home, Wifi, Utensils, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Housing = () => {
  const listings = [
    {
      id: 1,
      title: "Cozy Student Room in Alser Grund",
      location: "9th District, Vienna",
      rent: "€450/month",
      type: "WG",
      available: "March 1, 2025",
      amenities: ["Wifi", "Furnished", "Kitchen"],
      description: "15m² room in friendly 3-person WG. 5 min walk to U6 Alser Straße.",
    },
    {
      id: 2,
      title: "Modern Studio Near TU Wien",
      location: "4th District, Vienna",
      rent: "€650/month",
      type: "Studio",
      available: "Now",
      amenities: ["Wifi", "Private Bath", "Kitchen"],
      description: "25m² studio apartment, newly renovated. Perfect for focused studying.",
    },
    {
      id: 3,
      title: "Shared Apartment in Student Dorm",
      location: "2nd District, Vienna",
      rent: "€380/month",
      type: "Dorm",
      available: "September 1, 2025",
      amenities: ["Wifi", "Laundry", "Common Room"],
      description: "Official student housing with all amenities. International community.",
    },
    {
      id: 4,
      title: "Spacious Room in Währing",
      location: "18th District, Vienna",
      rent: "€520/month",
      type: "WG",
      available: "April 15, 2025",
      amenities: ["Wifi", "Balcony", "Garden"],
      description: "18m² room with balcony. Quiet neighborhood, close to tram.",
    },
  ];

  const housingTypes = [
    {
      icon: Home,
      title: "WG (Shared Flat)",
      price: "€350-550/month",
      description: "Most popular option. Share apartment with other students.",
    },
    {
      icon: Home,
      title: "Studio Apartment",
      price: "€600-900/month",
      description: "Private space with kitchen and bathroom. More independence.",
    },
    {
      icon: Home,
      title: "Student Dorms",
      price: "€300-450/month",
      description: "Affordable official housing with great community atmosphere.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Student Housing Help
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Find verified student accommodation in Vienna. We connect you with safe, affordable
            housing options near your university.
          </p>
          <Button variant="hero" size="lg" asChild className="bg-secondary hover:bg-secondary-light">
            <Link to="/dashboard">Search Housing Now</Link>
          </Button>
        </div>
      </section>

      {/* Housing Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Housing Options</h2>
            <p className="text-muted-foreground">Choose the type that fits your lifestyle and budget</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {housingTypes.map((type, index) => (
              <Card key={index} className="border-2 transition-smooth hover:border-primary hover:shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-4">
                    <type.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{type.title}</h3>
                  <p className="mb-4 text-2xl font-bold text-primary">{type.price}</p>
                  <p className="text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Listings */}
      <section className="gradient-subtle py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Available Listings</h2>
            <p className="text-muted-foreground">
              Recent verified housing options for students (login to see all listings)
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {listings.map((listing) => (
              <Card key={listing.id} className="border-2 transition-smooth hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-xl">{listing.title}</CardTitle>
                    <Badge className="bg-primary text-primary-foreground">{listing.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{listing.description}</p>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">{listing.rent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Available: {listing.available}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full" asChild>
                    <Link to="/dashboard">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/dashboard">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Need Help Finding Housing?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Tell us your preferences and budget, and we'll match you with suitable options. Plus,
              find compatible roommates through our House Buddy feature!
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/dashboard">Set Housing Preferences</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/find-buddy">Find a Roommate</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Housing;
