import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, UserPlus, Users, Coffee, BookOpen } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardBuddy = () => {
  const myProfile = {
    name: "Alex M.",
    age: 22,
    university: "TU Wien",
    budget: "€400-500",
    traits: ["Early bird", "Tidy", "Non-smoker", "Coffee lover"],
    looking: "2 roommates for 3-person WG",
  };

  const matches = [
    {
      id: 1,
      name: "Lisa K.",
      age: 23,
      university: "Uni Wien",
      match: "92%",
      traits: ["Early bird", "Organized", "Cook together"],
      looking: "Looking for 1 more person",
      initials: "LK",
    },
    {
      id: 2,
      name: "Marco S.",
      age: 21,
      university: "TU Wien",
      match: "88%",
      traits: ["Night owl", "Social", "Music lover"],
      looking: "Starting new group",
      initials: "MS",
    },
    {
      id: 3,
      name: "Sophie T.",
      age: 24,
      university: "WU Wien",
      match: "95%",
      traits: ["Early bird", "Quiet", "Study-focused"],
      looking: "Looking for 1 more person",
      initials: "ST",
    },
  ];

  const groups = [
    {
      id: 1,
      name: "Study Squad",
      members: 2,
      looking: 1,
      budget: "€450-550",
      location: "9th District",
      traits: ["Quiet", "Focused", "Non-smoker"],
    },
    {
      id: 2,
      name: "Social Butterflies",
      members: 3,
      looking: 1,
      budget: "€400-500",
      location: "2nd District",
      traits: ["Social", "Cook together", "Party-friendly"],
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">House Buddy</h1>
            <p className="text-muted-foreground">
              Find your perfect roommates and join compatible housing groups
            </p>
          </div>

          {/* My Profile Card */}
          <Card className="mb-8 border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Roommate Profile</CardTitle>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    {myProfile.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{myProfile.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {myProfile.age} years • {myProfile.university} • Budget: {myProfile.budget}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {myProfile.traits.map((trait, index) => (
                      <Badge key={index} variant="outline">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <Users className="mr-2 inline h-4 w-4" />
                    {myProfile.looking}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compatible Profiles */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Your Top Matches <Badge className="ml-2">{matches.length}</Badge>
              </h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <Card key={match.id} className="border-2 transition-smooth hover:border-primary">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {match.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{match.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {match.age} • {match.university}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">{match.match}</Badge>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {match.traits.map((trait, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground">{match.looking}</p>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Open Groups */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Open Groups</h2>
              <Button>Create New Group</Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {groups.map((group) => (
                <Card key={group.id} className="border-2 transition-smooth hover:border-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{group.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {group.members} members • Looking for {group.looking} more
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-semibold text-foreground">{group.budget}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">{group.location}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.traits.map((trait, index) => (
                        <Badge key={index} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full">View Group</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardBuddy;
