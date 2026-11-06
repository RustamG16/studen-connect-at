const testimonials = [
  {
    name: "Lisa M.",
    university: "TU Wien",
    text: "Care4Students helped me find €2,400 in bonuses I didn't know existed!",
  },
  {
    name: "Marco K.",
    university: "Uni Wien",
    text: "Found my perfect WG within two weeks. The roommate matching is amazing.",
  },
  {
    name: "Sarah T.",
    university: "WU Wien",
    text: "The support team walked me through every application step. So helpful!",
  },
];

/** Three pull quotes, hung from a hairline each. For reading: nothing moves. */
const Quotes = () => (
  <section className="rule clip-x" style={{ paddingBlock: "var(--section-y)" }}>
    <div className="shell-x">
      <div className="mb-8 md:mb-12">
        <h2 className="t-display mb-4">What Students Say</h2>
        <p className="t-lead text-ink-2">Real stories from real students</p>
      </div>

      <div className="grid gap-x-6 gap-y-8 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name} className="row-rule pt-5">
            <blockquote>
              <p className="t-pull-quote text-foreground">"{testimonial.text}"</p>
            </blockquote>
            <figcaption className="mt-4">
              <p className="font-semibold text-foreground">{testimonial.name}</p>
              <p className="t-meta text-ink-2">{testimonial.university}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Quotes;
