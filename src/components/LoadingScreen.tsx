import { useEffect, useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleAnimationComplete = () => {
    setFadeOut(true);
    setTimeout(onComplete, 400);
  };

  // Fallback: if animation takes too long, dismiss after 4s
  useEffect(() => {
    const fallback = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 400);
    }, 4000);
    return () => clearTimeout(fallback);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-400 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <AnimatedLogo
        className="h-72 w-72 md:h-80 md:w-80"
        loop={false}
        onComplete={handleAnimationComplete}
      />
      <p className="mt-4 text-xl font-semibold tracking-wide text-primary/90 animate-fade-in">
        Care4Students
      </p>
    </div>
  );
};

export default LoadingScreen;
