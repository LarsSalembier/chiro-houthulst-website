"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface AnimatedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  initialTransform?: string;
}

export default function AnimatedImage({
  src,
  alt,
  width,
  height,
  className,
  initialTransform = "",
}: AnimatedImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [style, setStyle] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const rotateMatch = /rotate\([^)]+\)/.exec(initialTransform);
    const baseRotation = rotateMatch ? rotateMatch[0] : "";
    const translatePart = initialTransform.replace(baseRotation, "").trim();

    const baseStyle = {
      aspectRatio: `${width} / ${height}`,
      transition:
        "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
      opacity: isVisible ? 1 : 0,
      transform: `${translatePart} ${baseRotation} scale(${isVisible ? 1 : 0.8})`,
    };

    const hoverStyle = isHovered
      ? {
          transform: `${translatePart} rotate(0deg) scale(1.05)`,
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }
      : {};

    setStyle({ ...baseStyle, ...hoverStyle });
  }, [isHovered, isVisible, width, height, className, initialTransform]);

  return (
    <div
      className={`absolute overflow-hidden rounded-[1.5rem] border border-[#000]/20 shadow-[0_15px_50px_rgba(0,0,0,0.1)] sm:rounded-3xl ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image src={src} alt={alt} className="object-cover" fill />
    </div>
  );
}
