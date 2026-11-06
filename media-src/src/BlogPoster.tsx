import React from "react";
import { Img, staticFile } from "remotion";
import { fitCut } from "./cutBoxes";
import { Ground, Hairline } from "./parts";

export type BlogPosterProps = { cut: string };

// 528x298 still. The object (not its padded square) fills 400 x 170 above a hairline, 57% of the height: it has to read at 96 px.
export const BlogPoster: React.FC<BlogPosterProps> = ({ cut }) => {
  const { size, left, top } = fitCut(cut, 400, 170, 264, 124);
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
          filter: "drop-shadow(0 3px 5px rgba(40,56,72,0.14))",
        }}
      />
      <Hairline x={24} y={248} width={480} />
    </Ground>
  );
};
