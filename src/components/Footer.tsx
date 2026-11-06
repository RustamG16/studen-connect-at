import { Link } from "react-router-dom";
import DragonflyMark from "@/components/brand/DragonflyMark";

const quickLinks = [
  { name: "Bonuses & Grants", path: "/bonuses" },
  { name: "Housing Help", path: "/housing" },
  { name: "Find a Buddy", path: "/find-buddy" },
  { name: "How It Works", path: "/how-it-works" },
];

const resources = [
  { name: "FAQ", path: "/faq" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Legal", path: "/legal" },
];

const linkClass = "flex min-h-11 items-center text-ink-2 link-underline";

const Footer = () => {
  return (
    <footer className="clip-x bg-background text-foreground" style={{ paddingBottom: "var(--tab-h)" }}>
      <div className="rule">
        <div className="shell-x grid gap-x-6 gap-y-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <DragonflyMark title="Care4Students" className="h-12 w-12 shrink-0 text-depth" />
              <span className="text-lg font-extrabold tracking-tight">Care4Students</span>
            </div>
            <p className="max-w-[34ch] text-ink-2">
              Your all-in-one platform for student funding, housing, and support in Austria.
            </p>
          </div>

          <div className="max-sm:col-span-1">
            <h3 className="t-eyebrow mb-2 text-ink-2">Quick Links</h3>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-sm:col-span-1">
            <h3 className="t-eyebrow mb-2 text-ink-2">Resources</h3>
            <ul>
              {resources.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="t-eyebrow mb-2 text-ink-2">Get in Touch</h3>
            <ul>
              <li className="flex min-h-11 items-center text-ink-2">hello@care4students.at</li>
              <li className="flex min-h-11 items-center text-ink-2 tnum">+43 123 456 789</li>
              <li className="flex min-h-11 items-center text-ink-2">Vienna, Austria</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rule">
        <div className="shell-x py-4 t-meta text-ink-2">
          <p>© {new Date().getFullYear()} Care4Students. All rights reserved.</p>
        </div>
      </div>

      {/* The name, whole, sitting on the closing rule: the last hairline on the site. */}
      <div data-footer-rule>
        <div className="shell-x">
          <div aria-hidden className="t-footer-wordmark pb-[0.06em] text-foreground">
            Care4Students
          </div>
        </div>
        <div data-footer-line className="origin-left border-t border-foreground" />
      </div>
    </footer>
  );
};

export default Footer;
