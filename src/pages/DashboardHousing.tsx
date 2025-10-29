import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MapPin, Euro, Home, Heart, ExternalLink } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { toast } from "sonner";

const DashboardHousing = () => {
  const [budget, setBudget] = useState([500]);
  
  const preferences = {
    location: "9th-18th District",
    budget: "€400-600",
    type: "WG",
    moveIn: "March 2025",
  };

  const matches = [
    {
      id: 1,
      title: "Cozy Room in 9th District",
      location: "Alser Grund",
      rent: "€450/month",
      type: "WG",
      match: "95%",
      amenities: ["Wifi", "Furnished", "Kitchen"],
      available: "March 1",
      saved: true,
    },
    {
      id: 2,
      title: "Modern Studio Near TU",
      location: "4th District",
      rent: "€620/month",
      type: "Studio",
      match: "88%",
      amenities: ["Wifi", "Private Bath", "Kitchen"],
      available: "Now",
      saved: false,
    },
    {
      id: 3,
      title: "Shared Flat in Währing",
      location: "18th District",
      rent: "€480/month",
      type: "WG",
      match: "92%",
      amenities: ["Wifi", "Balcony", "Garden"],
      available: "April 1",
      saved: true,
    },
  ];

  const handleSavePreferences = () => {
    toast.success("Housing preferences updated!");
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Housing</h1>
            <p className="text-muted-foreground">
              Manage your housing preferences and view personalized matches
            </p>
          </div>

          {/* Current Preferences */}
          <Card className="mb-8 border-2">
            <CardHeader>
              <CardTitle>Your Housing Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">{preferences.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold text-foreground">{preferences.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold text-foreground">{preferences.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Move-in Date</p>
                  <p className="font-semibold text-foreground">{preferences.moveIn}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="font-semibold text-foreground">Update Your Budget</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Maximum Monthly Rent</Label>
                    <span className="text-sm font-medium text-primary">€{budget[0]}</span>
                  </div>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={1000}
                    min={300}
                    step={50}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleSavePreferences}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          {/* Housing Matches */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Your Matches <Badge className="ml-2">{matches.length} New</Badge>
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Sort
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {matches.map((match) => (
                <Card key={match.id} className="border-2 transition-smooth hover:border-primary">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 text-xl font-semibold text-foreground">
                              {match.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{match.location}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={match.saved ? "text-red-500" : ""}
                          >
                            <Heart className={match.saved ? "fill-current" : ""} />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-foreground">{match.rent}</span>
                          </div>
                          <Badge>{match.type}</Badge>
                          <Badge variant="outline" className="border-primary text-primary">
                            {match.match} Match
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {match.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline">
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          Available: {match.available}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 md:w-40">
                        <Button size="sm" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          Contact Owner
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Request Form CTA */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    Need More Help Finding Housing?
                  </h3>
                  <p className="text-muted-foreground">
                    Submit a detailed housing request and our team will search for you
                  </p>
                </div>
                <Button>Submit Request</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardHousing;
