import React from "react";
import heroAthleteImg from "@/assets/hero-athlete.jpg";
import athlete2Img from "@/assets/athlete-2.jpg";
import athlete3Img from "@/assets/athlete-3.jpg";

// Slides through background images on a slow timer for ambient depth
const BG_IMAGES = [heroAthleteImg, athlete2Img, athlete3Img];

interface PageBackgroundProps {
  /** Override with a specific image URL */
  image?: string;
  /** Blur intensity (default 70px) */
  blur?: number;
  /** Opacity (default 0.07) */
  opacity?: number;
}

export default function PageBackground({ image, blur = 70, opacity = 0.07 }: PageBackgroundProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (image) return; // Don't cycle if specific image provided
    const timer = setInterval(() => {
      setCurrentIndex(i => (i + 1) % BG_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [image]);

  const src = image || BG_IMAGES[currentIndex];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <img
        key={src}
        src={src}
        alt=""
        style={{
          position: "absolute",
          inset: "-5%",
          width: "110%",
          height: "110%",
          objectFit: "cover",
          filter: `blur(${blur}px) saturate(0.25) brightness(1.1)`,
          opacity,
          transition: "opacity 2s ease",
        }}
      />
    </div>
  );
}
