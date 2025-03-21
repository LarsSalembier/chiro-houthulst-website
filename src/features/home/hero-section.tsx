"use client";

import { Button } from "@nextui-org/react";
import { type ReactNode } from "react";
import BlurFade from "~/components/animation/blur-fade";
import AnimatedImage from "~/components/ui/animated-image";
import SplitSection from "~/components/ui/split-section";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  stats: Record<string, number>;
  children?: ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  stats,
  children,
}: HeroSectionProps) {
  return (
    <SplitSection>
      <div className="w-full lg:max-w-[50%]">
        <BlurFade delay={0.15}>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="mb-8 max-w-[564px] text-lg font-normal opacity-60 sm:text-xl">
            {subtitle}
          </p>
        </BlurFade>

        <BlurFade delay={0.25}>
          <Button size="lg" color="primary" className="mb-8">
            Inschrijven
          </Button>
        </BlurFade>

        <BlurFade delay={0.3}>
          <section className="flex flex-row items-center gap-8">
            {Object.entries(stats).map(([key, data]) => (
              <p className="flex flex-col items-start" key={key}>
                <span className="text-4xl font-semibold sm:text-5xl">
                  {data}+
                </span>
                <span className="text-base font-normal capitalize">{key}</span>
              </p>
            ))}
          </section>
        </BlurFade>
        {children}
      </div>

      <aside className="relative mt-8 flex min-h-[450px] w-full justify-center sm:min-h-[500px] md:min-h-[650px] lg:min-h-[600px] lg:justify-end xl:min-h-[600px]">
        <AnimatedImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxaBH6J4oXDhskiH8OxmF37l2ceQIw5LuRqYWZ"
          alt="Openingsformatie van de Chiro"
          width={490}
          height={259}
          className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 sm:w-[400px] md:w-[480px] lg:w-[360px] xl:w-[460px]"
          initialTransform="translate(-50%, -120%) rotate(8deg)"
        />
        <AnimatedImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxfzT7N1nsk5mUnuYoVwLhe9EtXTpIW3KqxRFi"
          alt="Groepsfoto van de leidingsploeg"
          width={300}
          height={300}
          className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 sm:w-[260px] md:w-[300px] lg:w-[220px] xl:w-[260px]"
          initialTransform="translate(-80%, -30%) rotate(-8deg)"
        />
        <AnimatedImage
          src="https://o3x7nz292y.ufs.sh/f/9igZHUjyeBOxgePVg0rqKXTNnk8OeDP5t9HQuFpmAbJi6vla"
          alt="Een optreden van de leden bij het kampvuur"
          width={300}
          height={300}
          className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 sm:w-[260px] md:w-[300px] lg:w-[220px] xl:w-[260px]"
          initialTransform="translate(-25%, 10%) rotate(16deg)"
        />
      </aside>
    </SplitSection>
  );
}
