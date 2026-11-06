import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Ground, Hairline, Sweep } from "./parts";
import { fitCut } from "./cutBoxes";
import { easeOut, motionMs, toFrames } from "./tokens";

export type CardProps = { cut: string };

export const Card: React.FC<CardProps> = ({ cut }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = toFrames(motionMs.scene, fps);
  const up0 = Math.round(0.4 * fps);
  const down0 = Math.round(1.8 * fps);
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut } as const;
  const lift = interpolate(frame, [up0, up0 + d], [0, 1], clamp);
  const drop = interpolate(frame, [down0, down0 + d], [0, 1], clamp);
  const k = lift * (1 - drop);
  // The object, not its 960 px square, fills 400 x 220 above the hairline (61% of the 360 px tile): it still has to read at 96 px.
  const { size, left, top } = fitCut(cut, 400, 220, 240, 150);
  return (
    <Ground>
      <Img
        src={staticFile(`inputs/${cut}`)}
        style={{
          position: "absolute",
          left,
          top,
          width: size,
          height: size,
          transform: `translateY(${-10 * k}px) rotate(${-2 * k}deg)`,
          filter: `drop-shadow(0 ${3 + 5 * k}px ${5 + 4 * k}px rgba(40,56,72,${0.14 - 0.03 * k}))`,
        }}
      />
      <Hairline x={24} y={300} width={432} />
      <Sweep frame={frame} fps={fps} x={24} y={300} width={432} inAtSec={1.0} outAtSec={3.0} />
    </Ground>
  );
};
