import { useEffect, useRef, useState, type CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DragonflyMark from "@/components/brand/DragonflyMark";
import { DRAGONFLY_FRAMES } from "@/data/dragonflyFrames";
import { HERO_DESK_FRAMES, landing, phone } from "@/data/heroDesk";

const stats = [
  { figure: "€2,400+", label: "Average bonus value per student" },
  { figure: "5,000+", label: "Students supported" },
  { figure: "2 weeks", label: "Average time to find housing" },
];

const DESK = HERO_DESK_FRAMES > 0;

/**
 * The desk (build plan, "Hero pass"): a poster of a first-semester desk, first paint and every state without motion. From
 * 1280 px, inside the scrub guard, HomeMotion lays a `<video>` over it and scrubs it with the scroll. Nothing here needs
 * script: the dragonfly's rest position comes from heroDesk.ts as CSS custom properties. The box's size comes from the grid,
 * never from the media, so it shifts nothing whether or not a file arrives.
 */
const Desk = ({ onFailed }: { onFailed: () => void }) => {
  const image = useRef<HTMLImageElement>(null);

  // A cached or eager poster can finish before React attaches onError.
  useEffect(() => {
    const img = image.current;
    if (img?.complete && img.naturalWidth === 0) onFailed();
  }, [onFailed]);

  return (
    <>
      <div className="hero-media">
        <picture>
          <source media="(min-width: 768px)" srcSet={asset("/media/hero/desk.poster.webp")} width={960} height={960} />
          <img
            ref={image}
            src={asset("/media/hero/desk.poster-phone.webp")}
            alt=""
            width={780}
            height={360}
            decoding="async"
            {...{ fetchpriority: "high" }}
            onError={onFailed}
          />
        </picture>
      </div>
      <div className="hero-mark-frame">
        <div data-hero-pos className="hero-pos">
          <div data-hero-mark className="hero-mark">
            <img
              src={asset("/media/dragonfly/s384/frame-00.webp")}
              alt="Care4Students Dragonfly"
              width={384}
              height={384}
              decoding="async"
              className="block h-auto w-full"
            />
            <canvas data-dragonfly-canvas width={384} height={384} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Hero at its resting state. With the desk on, the stage holds the poster and the mark on the notebook page; with
 * HERO_DESK_FRAMES = 0 the page is exactly what it was before the pass (line-art or frame-00 mark, canvas for the scrub).
 */
const Hero = () => {
  const [failed, setFailed] = useState(false);
  const stageStyle = {
    "--lu": landing.first.u,
    "--lv": landing.first.v,
    "--pu": phone.landing.u,
    "--pv": phone.landing.v,
  } as CSSProperties;

  return (
    <section
      data-settle="wait"
      data-hero
      className={`clip-x flex flex-col ${DESK ? "hero-desk-layout" : ""}`}
      style={{ minHeight: "calc(100svh - var(--nav-h))" }}
    >
      <div className="shell-x flex flex-1 pb-8 pt-6 md:pb-4 md:pt-4">
        <div className="relative grid w-full content-start md:grid-cols-12 md:grid-rows-[1fr_auto_auto] md:gap-x-6">
          <h1 className="t-hero relative z-10 pb-[0.12em] md:col-span-7 md:row-span-3 md:row-start-1 md:self-end md:pb-[0.2em]">
            <span className="mask-line">
              <span data-hero-word className="block">Funding.</span>
            </span>{" "}
            <span className="mask-line">
              <span data-hero-word className="block [--i:1]">Housing.</span>
            </span>{" "}
            <span className="mask-line">
              <span data-hero-word className="block [--i:2]">Support.</span>
            </span>
          </h1>

          {DESK ? (
            <>
              <div data-hero-desk data-media={failed ? "failed" : "pending"} data-desk="poster" className="hero-stage" style={stageStyle}>
                <Desk onFailed={() => setFailed(true)} />
              </div>
              {failed ? (
                <div className="hidden md:col-span-5 md:col-start-8 md:row-start-1 md:block md:w-[min(34vw,calc(100svh-372px))] md:self-end md:justify-self-start">
                  <DragonflyMark title="Care4Students Dragonfly" strokeWidth={9} className="block h-auto w-full text-primary md:!text-ink" />
                </div>
              ) : null}
            </>
          ) : (
            /* The mark: behind the words on phones (62vw, bleeding 6vw off the right), in the right column from 768 px. */
            <div
              data-hero-mark
              className="pointer-events-none absolute -top-[6vw] right-[-6vw] z-0 w-[62vw] md:pointer-events-auto md:relative md:right-auto md:top-auto md:z-auto md:col-span-5 md:col-start-8 md:row-start-1 md:w-[min(34vw,calc(100svh-372px))] md:self-end md:justify-self-start"
            >
              {DRAGONFLY_FRAMES > 0 ? (
                <>
                  <picture>
                    <source media="(min-width: 768px)" srcSet={asset("/media/dragonfly/frame-00.webp")} width={960} height={960} />
                    <img
                      src={asset("/media/dragonfly/poster-phone.webp")}
                      alt="Care4Students Dragonfly"
                      width={640}
                      height={640}
                      decoding="async"
                      {...{ fetchpriority: "high" }}
                      className="block h-auto w-full"
                    />
                  </picture>
                  <canvas
                    data-dragonfly-canvas
                    width={960}
                    height={960}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-0 md:block"
                  />
                </>
              ) : (
                <DragonflyMark title="Care4Students Dragonfly" strokeWidth={9} className="block h-auto w-full text-primary md:!text-ink" />
              )}
            </div>
          )}

          {/* From 1280 px the lead and the CTAs sit on one opaque panel over the desk; below it the wrapper dissolves into the grid. */}
          <div className={DESK ? "hero-panel" : "contents"}>
            <p className={`t-lead relative z-10 max-w-[46ch] md:col-span-5 md:col-start-8 md:row-start-2 md:mt-3.5 ${DESK ? "mt-5" : "mt-8"}`}>
              Your complete platform for navigating student life in Austria. Find bonuses, secure housing, and connect
              with roommates – all in one place.
            </p>

            <div className="relative z-10 mt-6 flex flex-col gap-2 min-[360px]:flex-row md:col-span-5 md:col-start-8 md:row-start-3 md:mt-3.5">
              <Button variant="hero" asChild>
                <Link to="/bonuses">Explore Bonuses</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* The stat strip: the first hairline of the ledger, full bleed. These three moved up from mid-page, once only. */}
      <div data-stat-rule className="rule origin-left" />
      <ul className="shell-x grid md:grid-cols-3">
        {stats.map((stat, i) => (
          <li
            key={stat.figure}
            className={`grid grid-cols-[minmax(0,9.5rem)_1fr] items-baseline gap-x-4 py-4 max-md:border-t max-md:first:border-t-0 md:block md:py-[18px] ${
              i > 0 ? "md:border-l md:pl-6" : ""
            }`}
          >
            <p className="t-stat text-foreground">{stat.figure}</p>
            <p className="t-meta text-ink-2 md:mt-2">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Hero;
