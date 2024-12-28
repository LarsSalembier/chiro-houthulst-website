"use client";

import { Button } from "@nextui-org/react";
import DotPattern from "~/components/ui/dot-pattern";
import BlurFade from "./blur-fade";
import Card from "~/components/ui/card";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "./navbar";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <main className="min-h-screen w-full">
        <Navbar />
        <DotPattern className="[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]" />
        <div className="container mx-auto flex flex-col items-center justify-between px-4 pb-8 pt-12 sm:px-8 sm:pb-8 md:px-16 md:pt-16 lg:flex-row lg:px-32 lg:pt-0">
          <div className="w-full lg:max-w-[50%]">
            <BlurFade delay={0.15}>
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Welkom bij Chiro Houthulst
              </h1>
            </BlurFade>

            <BlurFade delay={0.2}>
              <p className="mb-8 max-w-[564px] text-lg font-normal opacity-60 sm:text-xl">
                De Chiro is een jeugdbeweging voor jongens en meisjes van 6 tot
                18 jaar. Elke zondag van 14u tot 17u is er Chiro in Houthulst.
                Kom zeker eens langs!
              </p>
            </BlurFade>

            <BlurFade delay={0.25}>
              <Button size="lg" color="primary" className="mb-8">
                Inschrijven
              </Button>
            </BlurFade>

            <BlurFade delay={0.35}>
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-semibold sm:text-5xl">
                    150+
                  </span>
                  <span className="text-base font-normal">Leden</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-semibold sm:text-5xl">26</span>
                  <span className="text-base font-normal">Leiding</span>
                </div>
              </div>
            </BlurFade>
          </div>

          <div className="relative mt-8 flex min-h-[400px] w-full justify-center sm:min-h-[500px] md:min-h-[650px] lg:min-h-[600px] lg:justify-end xl:min-h-[600px]">
            <Card
              src="https://scontent-bru2-1.xx.fbcdn.net/v/t39.30808-6/336170969_6148429455242376_5326502316521295029_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=GnH7z3Pe0BwQ7kNvgE5LZrF&_nc_zt=23&_nc_ht=scontent-bru2-1.xx&_nc_gid=A1YMlLwpL3OARWtlBnenhzT&oh=00_AYDau28pvOz7BXMlac4EWvPyh0fltCAPXEA5tvpJNkdjFw&oe=676E9693"
              alt="Hero image"
              width={490}
              height={259}
              className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 sm:w-[400px] md:w-[480px] lg:w-[360px] xl:w-[460px]"
              isVisible={isVisible}
              initialTransform="translate(-50%, -120%) rotate(5deg)"
            />
            <Card
              src="https://scontent-bru2-1.xx.fbcdn.net/v/t39.30808-6/464803099_8550617101686238_5963319152976389197_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=psb7bXc4Q8QQ7kNvgERvPMJ&_nc_zt=23&_nc_ht=scontent-bru2-1.xx&_nc_gid=A3XfdRjeK5QltIqu9HDjKke&oh=00_AYAd9mM0RtuUVlF5yP1-Ln4hKYD6AEI89GXxWh1iCp8zog&oe=676E98F3"
              alt="Hero image"
              width={300}
              height={300}
              className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 sm:w-[260px] md:w-[300px] lg:w-[220px] xl:w-[260px]"
              isVisible={isVisible}
              initialTransform="translate(-80%, -30%) rotate(-8deg)"
            />
            <Card
              src="https://scontent-bru2-1.xx.fbcdn.net/v/t39.30808-6/464150531_8501472123267403_8938682712471834656_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=ipI9Uce6fjMQ7kNvgHwd_bc&_nc_zt=23&_nc_ht=scontent-bru2-1.xx&_nc_gid=A4wQsMrVFeCWyVGSFHVTh5D&oh=00_AYBVVUgOel4ibLsnuVIairFNZVlCAnfc3-ILTkhIsrJjRg&oe=676EA1E5"
              alt="Hero image"
              width={300}
              height={300}
              className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 sm:w-[260px] md:w-[300px] lg:w-[220px] xl:w-[260px]"
              isVisible={isVisible}
              initialTransform="translate(-25%, 10%) rotate(16deg)"
            />
          </div>
        </div>
      </main>
    </>
  );
}
