import React from "react";
import { Img, staticFile } from "remotion";
import content from "../content.json";
import { FONT, loadFonts } from "./fonts";
import { Ground, Hairline } from "./parts";
import { colors } from "./tokens";

// 1200x630 share image. Frame 00 of the dragonfly sequence at rest, the wordmark and the three hero words.
export const Og: React.FC = () => {
  loadFonts();
  return (
    <Ground>
      <Img
        src={staticFile("inputs/dragonfly-frame-00.webp")}
        style={{ position: "absolute", left: 640, top: 40, width: 480, height: 480 }}
      />
      <Hairline x={64} y={532} width={1072} />
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 410,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: colors.ink,
          whiteSpace: "nowrap",
        }}
      >
        {content.og.wordmark}
      </div>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 558,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          color: colors["ink-2"],
          whiteSpace: "nowrap",
        }}
      >
        {content.og.line}
      </div>
    </Ground>
  );
};
