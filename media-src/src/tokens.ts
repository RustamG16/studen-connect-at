import { Easing } from "remotion";
import generated from "./tokens.generated.json";

// Everything here comes from the site's design.json through scripts/sync-inputs.mjs.
const ms = (s: string) => parseFloat(s);
const bezier = (s: string) => {
  const n = s.match(/-?\d*\.?\d+/g)!.map(Number);
  return Easing.bezier(n[0], n[1], n[2], n[3]);
};

export const colors = generated.colors;
export const motionMs = {
  micro: ms(generated.motion.micro),
  move: ms(generated.motion.move),
  scene: ms(generated.motion.scene),
  stagger: ms(generated.motion.stagger),
};
export const easeOut = bezier(generated.motion["ease-out"]);
export const easeInOut = bezier(generated.motion["ease-in-out"]);
export const rulePx = ms(generated.spacing.rule);
export const ruleHoverPx = ms(generated.spacing["rule-hover"]);

export const toFrames = (millis: number, fps: number) => Math.round((millis * fps) / 1000);
export const secToFrames = (s: number, fps: number) => Math.round(s * fps);
