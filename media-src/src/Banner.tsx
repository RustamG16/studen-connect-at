import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import content from "../content.json";
import { FONT, loadFonts } from "./fonts";
import { Ground, Hairline, Paper, Sweep } from "./parts";
import { colors } from "./tokens";

export type BannerProps = {
  /** folder under public/work holding the clip's frames as 0001.jpg ... */
  clip: string;
  /** number of source frames */
  sourceFrames: number;
  /** "direct" plays the clip; "pingpong" plays it forward and back so it closes on itself */
  mode: "direct" | "pingpong";
  /** source frames advanced per output frame (pingpong only) */
  rate: number;
  eyebrow: keyof typeof content.eyebrows;
};

const WIN = { x: 24, y: 24, w: 806, h: 376 };
const RULE_Y = 412;

export const sourceIndex = (
  frame: number,
  p: Pick<BannerProps, "sourceFrames" | "mode" | "rate">,
  total: number,
) => {
  if (p.mode === "direct") return Math.min(frame, p.sourceFrames - 1);
  const half = total / 2;
  const t = frame <= half ? frame : total - frame;
  return Math.min(Math.round(t * p.rate), p.sourceFrames - 1);
};

export const Banner: React.FC<BannerProps> = (p) => {
  loadFonts();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const idx = sourceIndex(frame, p, durationInFrames);
  const src = staticFile(`work/${p.clip}/${String(idx + 1).padStart(4, "0")}.jpg`);
  // The clip is 854 px wide and is only ever scaled down: cover-fit into 806x376 gives 0.944.
  return (
    <Ground>
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          overflow: "hidden",
          outline: `1px solid ${colors.line}`,
        }}
      >
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <Paper opacity={0.35} offsetX={-37} offsetY={-11} />
      </div>
      <Hairline x={WIN.x} y={RULE_Y} width={WIN.w} />
      <Sweep frame={frame} fps={fps} x={WIN.x} y={RULE_Y} width={WIN.w} inAtSec={1.0} outAtSec={3.0} />
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: 424,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          color: colors.ink,
          whiteSpace: "nowrap",
        }}
      >
        {content.eyebrows[p.eyebrow]}
      </div>
    </Ground>
  );
};
