import React from "react";
import { Composition, Still } from "remotion";
import { Banner, BannerProps } from "./Banner";
import { BlogPoster, BlogPosterProps } from "./BlogPoster";
import { Card, CardProps } from "./Card";
import { Og } from "./Og";

const bannerDefaults: BannerProps = {
  clip: "housing",
  sourceFrames: 121,
  mode: "direct",
  rate: 1,
  eyebrow: "housing",
};
const cardDefaults: CardProps = { cut: "cut-coin.webp" };
const posterDefaults: BlogPosterProps = { cut: "cut-coin.webp" };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Banner"
      component={Banner as React.FC<any>}
      width={854}
      height={480}
      fps={24}
      durationInFrames={120}
      defaultProps={bannerDefaults}
    />
    <Composition
      id="Card"
      component={Card as React.FC<any>}
      width={480}
      height={360}
      fps={30}
      durationInFrames={120}
      defaultProps={cardDefaults}
    />
    <Still id="BlogPoster" component={BlogPoster as React.FC<any>} width={528} height={298} defaultProps={posterDefaults} />
    <Still id="Og" component={Og} width={1200} height={630} />
  </>
);
