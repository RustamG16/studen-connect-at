import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, FileText, Euro } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const DashboardBonuses = () => {
  const myBonuses = [
    {
      name: "Studienbeihilfe",
      amount: "€5,040/year",
      status: "In Review",
      progress: 75,
      deadline: "December 15, 2025",
      missingDocs: ["Income proof from parents"],
    },
    {
      name: "Wohnbeihilfe",
      amount: "€3,600/year",
      status: "Not Started",
      progress: 0,
      deadline: "Ongoing",
      missingDocs: ["Rental contract", "Income declaration"],
    },
    {
      name: "Familienbeihilfe",
      amount: "€1,476/year",
      status: "Approved",
      progress: 100,
      deadline: "-",
      missingDocs: [],
    },
  ];

  const availableBonuses = [
    {
      name: "ÖH Sozialfonds",
      amount: "€500-2,000",
      eligibility: "95% match",
      deadline: "March 31, 2025",
    },
    {
      name: "Leistungsstipendium",
      amount: "€750-1,500",
      eligibility: "80% match",
      deadline: "May 1, 2025",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "In Review":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "In Review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Bonuses</h1>
            <p className="text-muted-foreground">
              Track your applications and discover new funding opportunities
            </p>
          </div>

          {/* Total Potential */}
          <Card className="mb-8 border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Total Potential Funding</p>
                  <h2 className="text-4xl font-bold text-primary">€8,640/year</h2>
                </div>
                <Euro className="h-16 w-16 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          {/* Active Applications */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Active Applications</h2>
            <div className="space-y-4">
              {myBonuses.map((bonus, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(bonus.status)}
                        <div>
                          <CardTitle className="text-xl">{bonus.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{bonus.amount}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(bonus.status)} border`}>
                        {bonus.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Application Progress</span>
                        <span className="font-medium text-foreground">{bonus.progress}%</span>
                      </div>
                      <Progress value={bonus.progress} className="h-2" />
                    </div>

                    {bonus.missingDocs.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-foreground">
                          Missing Documents:
                        </p>
                        <ul className="space-y-1">
                          {bonus.missingDocs.map((doc, docIndex) => (
                            <li key={docIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Deadline: <span className="font-medium text-foreground">{bonus.deadline}</span>
                      </p>
                      <Button size="sm">
                        {bonus.status === "Not Started" ? "Start Application" : "Continue"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Bonuses */}
          <div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">More Opportunities for You</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {availableBonuses.map((bonus, index) => (
                <Card key={index} className="border-2 transition-smooth hover:border-primary">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="mb-1 text-lg font-semibold text-foreground">{bonus.name}</h3>
                      <p className="text-2xl font-bold text-primary">{bonus.amount}</p>
                    </div>
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Eligibility Match</span>
                      <Badge className="bg-primary text-primary-foreground">{bonus.eligibility}</Badge>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">Deadline: {bonus.deadline}</p>
                    <Button className="w-full">Learn More</Button>
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

export default DashboardBonuses;
