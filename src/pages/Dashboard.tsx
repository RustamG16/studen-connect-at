import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Euro, Home, Users, FileText, ArrowRight, CheckCircle, Clock } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const Dashboard = () => {
  const stats = [
    {
      title: "Potential Bonuses",
      value: "€8,640",
      description: "4 bonuses available",
      icon: Euro,
      link: "/dashboard/bonuses",
    },
    {
      title: "Housing Matches",
      value: "12",
      description: "New listings this week",
      icon: Home,
      link: "/dashboard/housing",
    },
    {
      title: "Buddy Matches",
      value: "8",
      description: "Compatible profiles",
      icon: Users,
      link: "/dashboard/buddy",
    },
    {
      title: "Documents",
      value: "6/10",
      description: "Uploaded",
      icon: FileText,
      link: "/dashboard/documents",
    },
  ];

  const recentActivity = [
    {
      title: "Studienbeihilfe Application",
      status: "In Review",
      date: "2 days ago",
      icon: Clock,
    },
    {
      title: "Housing Request Submitted",
      status: "Active",
      date: "3 days ago",
      icon: Clock,
    },
    {
      title: "New Buddy Match Found",
      status: "Completed",
      date: "5 days ago",
      icon: CheckCircle,
    },
  ];

  const nextSteps = [
    {
      title: "Complete Your Profile",
      description: "Add more details to get better matches",
      progress: 60,
    },
    {
      title: "Upload Income Documents",
      description: "Required for Studienbeihilfe application",
      progress: 0,
    },
    {
      title: "Review Housing Matches",
      description: "12 new listings match your preferences",
      progress: 100,
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Welcome back, Student!</h1>
            <p className="text-muted-foreground">
              Here's your personalized overview of bonuses, housing, and roommate opportunities.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-2 transition-smooth hover:border-primary hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={stat.link}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <h3 className="mb-1 text-2xl font-bold text-foreground">{stat.value}</h3>
                  <p className="mb-1 text-sm font-medium text-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Next Steps */}
            <div className="lg:col-span-2">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Your Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {nextSteps.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <span className="text-sm font-medium text-primary">{step.progress}%</span>
                      </div>
                      <Progress value={step.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-primary/10 p-2">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground">{activity.status}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-foreground">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Button size="lg" asChild className="h-auto flex-col items-start p-6">
                <Link to="/dashboard/bonuses">
                  <Euro className="mb-2 h-6 w-6" />
                  <span className="text-base font-semibold">Apply for Bonuses</span>
                  <span className="text-xs font-normal opacity-90">4 available for you</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-auto flex-col items-start p-6">
                <Link to="/dashboard/housing">
                  <Home className="mb-2 h-6 w-6" />
                  <span className="text-base font-semibold">Browse Housing</span>
                  <span className="text-xs font-normal opacity-90">12 new matches</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-auto flex-col items-start p-6">
                <Link to="/dashboard/buddy">
                  <Users className="mb-2 h-6 w-6" />
                  <span className="text-base font-semibold">Find Roommates</span>
                  <span className="text-xs font-normal opacity-90">8 compatible profiles</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
