import { useState } from "react";
import AuthCta from "@/components/AuthCta";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/asset";
import { AAU_PRESS, AAU_PRESS_SLOTS } from "@/data/aauPress";

const benefits = [
  "Save time with automated application tracking",
  "Never miss a funding deadline",
  "Connect with verified student housing",
  "Find your perfect roommate match",
  "Get expert support 24/7",
  "All services completely free",
];

/** The check is drawn in strokes so the motion slice can draw it; at rest the stroke is complete. */
const Check = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className="mt-[0.2em] h-6 w-6 shrink-0 text-primary-text"
  >
    <path data-check pathLength={1} d="M4 12.5 L9.5 18 L20 6.5" />
  </svg>
);

// A63: the campus aerial, CC BY-SA 3.0. Three widths of the one file; the caption is the licence's condition, so it never
// shows without its photo. The press-photo switch (A64) is off in every public build.
const CAMPUS = "/media/photos/campus-aerial";
const PHOTO_BASE = AAU_PRESS ? AAU_PRESS_SLOTS.why.base : CAMPUS;
const photo = (width: number) => asset(`${PHOTO_BASE}-${width}.webp`);
const PHOTO_ALT = AAU_PRESS ? AAU_PRESS_SLOTS.why.alt : "Aerial view of the university campus in Klagenfurt, by the Wörthersee";

const Credit = () =>
  AAU_PRESS ? (
    <>{AAU_PRESS_SLOTS.why.credit}</>
  ) : (
    <>
      Photo: <a href="https://commons.wikimedia.org/wiki/File:Aau_luftbild.jpg" className="inline-block py-[1.5px] text-primary-text underline underline-offset-2">“Aau luftbild”</a> by Uniklupresse,{" "}
      <a href="https://creativecommons.org/licenses/by-sa/3.0/" className="inline-block py-[1.5px] text-primary-text underline underline-offset-2">CC BY-SA 3.0</a>, via Wikimedia Commons
    </>
  );

const Why = () => {
  // If the photo fails (blocked, missing, or the _redirects HTML-200 trap), the figure and its caption go together.
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section className="rule clip-x" style={{ paddingBlock: "var(--section-y)" }}>
      <div className="shell-x">
        <h2 className="t-display mb-8 md:mb-12">
          Why Students <em className="t-serif -mx-[0.08em] px-[0.08em]">Choose</em> Us
        </h2>

        <div className="grid items-start gap-x-6 min-[1280px]:grid-cols-12">
          {photoFailed ? null : (
            <figure
              data-why-photo
              className="mb-8 min-[768px]:mb-12 min-[768px]:w-[calc(58.3333%-10px)] min-[1280px]:mb-0 min-[1280px]:col-span-5 min-[1280px]:w-auto"
            >
              <img
                src={photo(1104)}
                srcSet={`${photo(720)} 720w, ${photo(1104)} 1104w, ${photo(1600)} 1600w`}
                sizes="(min-width: 1280px) 39vw, (min-width: 768px) 55vw, 100vw"
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                alt={PHOTO_ALT}
                onError={() => setPhotoFailed(true)}
                className="block aspect-[3/2] h-auto w-full border border-border object-cover"
              />
              <figcaption className="t-meta mt-2 text-ink-2">
                <Credit />
              </figcaption>
            </figure>
          )}

          <div className={photoFailed ? "min-[1280px]:col-span-12" : "min-[1280px]:col-span-7"}>
            <ul className="grid gap-x-6 border-b md:grid-flow-col md:grid-cols-2 md:grid-rows-3 md:gap-x-12">
              {benefits.map((benefit) => (
                <li key={benefit} data-why-row className="row-rule flex items-start gap-4 py-5">
                  <Check />
                  <p className="text-lg text-foreground">{benefit}</p>
                </li>
              ))}
            </ul>

            <Button size="lg" className="mt-8 md:mt-12" asChild>
              <AuthCta>Get Started Free</AuthCta>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;
