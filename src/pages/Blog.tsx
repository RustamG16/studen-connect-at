import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "Complete Guide to Studienbeihilfe 2025",
      excerpt:
        "Everything you need to know about applying for Austria's main student grant, including requirements, deadlines, and tips for success.",
      category: "Bonuses",
      date: "January 15, 2025",
      readTime: "8 min read",
      trending: true,
    },
    {
      id: 2,
      title: "Finding Student Housing in Vienna: A Step-by-Step Guide",
      excerpt:
        "Navigate the Vienna housing market with confidence. Learn about different housing types, average costs, and red flags to avoid.",
      category: "Housing",
      date: "January 12, 2025",
      readTime: "10 min read",
      trending: true,
    },
    {
      id: 3,
      title: "How to Choose the Perfect Roommate",
      excerpt:
        "Discover the key factors to consider when selecting roommates and how to ensure a harmonious living situation.",
      category: "House Buddy",
      date: "January 10, 2025",
      readTime: "6 min read",
      trending: false,
    },
    {
      id: 4,
      title: "Top 5 Student Bonuses You Didn't Know About",
      excerpt:
        "Uncover hidden funding opportunities that most students miss. These bonuses could add up to €3,000+ annually.",
      category: "Bonuses",
      date: "January 8, 2025",
      readTime: "7 min read",
      trending: true,
    },
    {
      id: 5,
      title: "Budget-Friendly Student Life in Vienna",
      excerpt:
        "Tips and tricks for living comfortably on a student budget. Learn about discounts, free activities, and money-saving strategies.",
      category: "Lifestyle",
      date: "January 5, 2025",
      readTime: "9 min read",
      trending: false,
    },
    {
      id: 6,
      title: "Understanding Your Rights as a Tenant",
      excerpt:
        "Essential information about rental laws in Austria. Know your rights and responsibilities before signing a contract.",
      category: "Housing",
      date: "January 3, 2025",
      readTime: "12 min read",
      trending: false,
    },
  ];

  const categories = ["All", "Bonuses", "Housing", "House Buddy", "Lifestyle"];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Student Life Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90">
            Tips, guides, and resources to help you navigate student life in Austria
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Latest Articles</h2>
            <p className="text-muted-foreground">
              Stay informed with the latest tips and insights for student success
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {posts.map((post) => (
              <Card key={post.id} className="border-2 transition-smooth hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-2">
                    <Badge>{post.category}</Badge>
                    {post.trending && (
                      <Badge variant="outline" className="border-primary text-primary">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl hover:text-primary transition-smooth cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <Button variant="ghost" className="group p-0">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="gradient-subtle py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl border-2">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Stay Updated with Student Tips
              </h2>
              <p className="mb-6 text-muted-foreground">
                Get the latest guides and updates delivered to your inbox every week
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-sm transition-smooth focus:border-primary focus:outline-none"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
