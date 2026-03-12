import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import animationData from "@/assets/loading.json";

interface AnimatedLogoProps {
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  onComplete?: () => void;
}

const AnimatedLogo = ({
  className,
  loop = true,
  autoplay = true,
  onComplete,
}: AnimatedLogoProps) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      onComplete={onComplete}
      className={className}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
};

export default AnimatedLogo;
