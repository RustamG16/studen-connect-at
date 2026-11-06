import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import { usePageRows } from "@/components/page/usePageRows";

const contactMethods = [
  {
    title: "Email Us",
    value: "hello@care4students.at",
    description: "Send us an email anytime",
  },
  {
    title: "Call Us",
    value: "+43 123 456 789",
    description: "Mon-Fri, 9:00 - 18:00",
  },
  {
    title: "Visit Us",
    value: "Vienna, Austria",
    description: "By appointment only",
  },
  {
    title: "Live Chat",
    value: "Available 24/7",
    description: "Instant support in dashboard",
  },
];


const labelClass = "mb-2 block text-sm font-bold text-foreground";

const Contact = () => {
  const rows = usePageRows();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="Get in Touch"
        lead="Have questions? Need help? Our team is here to support you every step of the way."
      />

      <div ref={rows}>
        <section className="clip-x" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x">
            <div className="mb-8 md:mb-12">
              <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Ways to Reach Us</h2>
              <p className="t-lead max-w-[46ch] text-ink-2">Choose the method that works best for you</p>
            </div>
            <ul className="border-b">
              {contactMethods.map((method, i) => (
                <li
                  key={method.title}
                  data-rule-row
                  style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
                  className="row-rule grid gap-x-6 gap-y-1 py-5 md:grid-cols-12 md:items-baseline md:py-7"
                >
                  <h3 className="t-row-name text-ink-2 md:col-span-3">{method.title}</h3>
                  <p className="tnum text-xl font-bold md:col-span-5 md:text-2xl">{method.value}</p>
                  <p className="text-ink-2 md:col-span-4">{method.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="clip-x rule" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x grid gap-x-6 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Send Us a Message</h2>
              <p className="t-lead max-w-[36ch] text-ink-2">Fill out the form below and we'll respond within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 md:col-span-6 md:col-start-7">
              <div>
                <Label htmlFor="name" className={labelClass}>Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Anna Müller"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="email" className={labelClass}>Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="anna@example.com"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="subject" className={labelClass}>Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="message" className={labelClass}>Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your question or issue..."
                  required
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default Contact;
