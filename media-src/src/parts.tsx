import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { colors, easeInOut, motionMs, toFrames } from "./tokens";

// Paper ground: canvas colour with the CC0 paper scan multiplied over it.
export const Paper: React.FC<{ opacity?: number; offsetX?: number; offsetY?: number }> = ({
  opacity = 1,
  offsetX = 0,
  offsetY = 0,
}) => (
  <Img
    src={staticFile("inputs/paper-clean.jpg")}
    style={{
      position: "absolute",
      left: offsetX,
      top: offsetY,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      mixBlendMode: "multiply",
      opacity,
    }}
  />
);

export const Ground: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, background: colors.canvas, overflow: "hidden" }}>
    <Paper />
    {children}
  </div>
);

// 2px ink segment: grows from the left over `move`, then leaves toward the right over `move`.
export const Sweep: React.FC<{
  frame: number;
  fps: number;
  x: number;
  y: number;
  width: number;
  inAtSec: number;
  outAtSec: number;
}> = ({ frame, fps, x, y, width, inAtSec, outAtSec }) => {
  const d = toFrames(motionMs.move, fps);
  const inStart = Math.round(inAtSec * fps);
  const outStart = Math.round(outAtSec * fps);
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut } as const;
  const grow = interpolate(frame, [inStart, inStart + d], [0, 1], clamp);
  const leave = interpolate(frame, [outStart, outStart + d], [0, 1], clamp);
  const leaving = frame >= outStart;
  const scale = leaving ? 1 - leave : grow;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - 1,
        width,
        height: 2,
        background: colors.ink,
        transformOrigin: leaving ? "right center" : "left center",
        transform: `scaleX(${scale})`,
      }}
    />
  );
};

export const Hairline: React.FC<{ x: number; y: number; width: number }> = ({ x, y, width }) => (
  <div style={{ position: "absolute", left: x, top: y, width, height: 1, background: colors.line }} />
);
