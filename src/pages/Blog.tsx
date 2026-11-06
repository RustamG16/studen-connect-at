import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import { usePageRows } from "@/components/page/usePageRows";
import PostPoster from "@/components/media/PostPoster";

const posts = [
  {
    id: 1,
    title: "Complete Guide to Studienbeihilfe 2025",
    excerpt:
      "Everything you need to know about applying for Austria's main student grant, including requirements, deadlines, and tips for success.",
    category: "Bonuses",
    poster: "blog-bonuses",
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
    poster: "blog-housing",
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
    poster: "blog-buddy",
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
    poster: "blog-bonuses",
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
    poster: "blog-lifestyle",
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
    poster: "blog-housing",
    date: "January 3, 2025",
    readTime: "12 min read",
    trending: false,
  },
];

const categories = ["All", "Bonuses", "Housing", "House Buddy", "Lifestyle"];


const Blog = () => {
  const rows = usePageRows();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Blog"
        title="Student Life Blog"
        lead="Tips, guides, and resources to help you navigate student life in Austria"
      />

      <div className="shell-x">
        <ul className="-mx-3 flex flex-wrap py-3 md:py-4">
          {categories.map((category) => (
            <li key={category}>
              <button
                type="button"
                aria-pressed={category === "All"}
                className={`inline-flex min-h-11 items-center px-3 text-sm font-bold underline-offset-[0.5em] transition-colors hover:underline ${
                  category === "All" ? "text-foreground underline decoration-2" : "text-ink-2"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section ref={rows} className="clip-x rule" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="shell-x">
          <div className="mb-8 md:mb-12">
            <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Latest Articles</h2>
            <p className="t-lead max-w-[46ch] text-ink-2">
              Stay informed with the latest tips and insights for student success
            </p>
          </div>

          <ul className="border-b">
            {posts.map((post, i) => (
              <li
                key={post.id}
                data-rule-row
                style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
                className="row-rule grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 py-6 md:grid-cols-12 md:py-9"
              >
                <p className="t-meta tnum text-ink-2 md:col-span-2">
                  <span className="block font-bold text-foreground">{post.date}</span>
                  <span>{post.readTime}</span>
                </p>
                <div className="col-span-2 md:col-span-7">
                  <p className="t-meta mb-2 font-bold">
                    {post.category}
                    {post.trending ? (
                      <>
                        <span aria-hidden="true" className="text-ink-2"> · </span>
                        <span className="text-primary-text">Trending</span>
                      </>
                    ) : null}
                  </p>
                  <h3 className="mb-2 text-2xl font-extrabold leading-tight md:text-3xl">{post.title}</h3>
                  <p className="max-w-[56ch] text-ink-2">{post.excerpt}</p>
                </div>
                <div className="contents md:col-span-3 md:flex md:flex-col md:items-end md:gap-4">
                  <PostPoster name={post.poster} className="col-start-2 row-start-1 self-start md:order-first md:self-auto" />
                  <Button variant="link" className="col-span-2 h-11 justify-self-start px-0 text-primary-text underline">
                    Read More
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 md:mt-12">
            <Button size="lg" variant="outline">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      <section className="clip-x rule" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="shell-x grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Stay Updated with Student Tips</h2>
            <p className="t-lead max-w-[40ch] text-ink-2">
              Get the latest guides and updates delivered to your inbox every week
            </p>
          </div>
          <div className="flex gap-3 md:col-span-5 md:col-start-8">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Enter your email"
              className="flex h-12 min-w-0 flex-1 rounded-lg border border-input bg-card px-4 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Blog;
