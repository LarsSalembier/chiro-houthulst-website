import AnimatedImage from "./animated-image";

interface AsideImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  side: "left" | "right";
  className?: string;
}

export default function AsideImage({
  src,
  alt,
  width,
  height,
  side,
  className,
}: AsideImageProps) {
  const rotation = side === "left" ? "-5deg" : "5deg";
  const translation = side === "left" ? "-10px" : "10px";

  return (
    <aside className="hidden h-full w-full items-center justify-start lg:flex">
      <AnimatedImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        initialTransform={`rotate(${rotation}) translate(${translation})`}
      />
    </aside>
  );
}
