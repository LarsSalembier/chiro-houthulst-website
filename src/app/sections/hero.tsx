import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BlurFade from "~/components/animation/blur-fade";
import HeroImage from "../components/hero-image";

const MEMBER_COUNT = 150;
const LEADER_COUNT = 26;

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="w-full lg:max-w-[50%]">
        <BlurFade delay={0.15}>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Welkom bij Chiro Houthulst
          </h1>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="mb-8 max-w-[564px] text-lg font-normal opacity-60 sm:text-xl">
            De Chiro is een jeugdbeweging voor jongens en meisjes van 6 tot 18
            jaar. Elke zondag van 14u tot 17u is er Chiro in Houthulst. Kom
            zeker eens langs!
          </p>
        </BlurFade>

        <BlurFade delay={0.25}>
          <Button size="lg" color="primary" className="mb-8">
            Inschrijven
          </Button>
        </BlurFade>

        <BlurFade delay={0.35}>
          <section className="flex flex-row items-center gap-8">
            <p className="flex flex-col items-start">
              <span className="text-4xl font-semibold sm:text-5xl">
                {MEMBER_COUNT}+
              </span>
              <span className="text-base font-normal">Leden</span>
            </p>
            <p className="flex flex-col items-start">
              <span className="text-4xl font-semibold sm:text-5xl">
                {LEADER_COUNT}
              </span>
              <span className="text-base font-normal">Leiding</span>
            </p>
          </section>
        </BlurFade>
      </section>

      <aside className="relative mt-8 flex min-h-[400px] w-full justify-center sm:min-h-[500px] md:min-h-[650px] lg:min-h-[600px] lg:justify-end xl:min-h-[600px]">
        <HeroImage
          src="https://utfs.io/f/9igZHUjyeBOxaBH6J4oXDhskiH8OxmF37l2ceQIw5LuRqYWZ"
          alt="Openingsformatie van de Chiro"
          width={490}
          height={259}
          className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 sm:w-[400px] md:w-[480px] lg:w-[360px] xl:w-[460px]"
          isVisible={isVisible}
          initialTransform="translate(-50%, -120%) rotate(8deg)"
        />
        <HeroImage
          src="https://utfs.io/f/9igZHUjyeBOxOHjQYQDLdrcJxV1NFnGgOwqp5MHQKjo39f8E"
          alt="Groepsfoto op zondag"
          width={300}
          height={300}
          className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 sm:w-[260px] md:w-[300px] lg:w-[220px] xl:w-[260px]"
          isVisible={isVisible}
          initialTransform="translate(-80%, -30%) rotate(-8deg)"
        />
        <HeroImage
          src="https://utfs.io/f/9igZHUjyeBOxgePVg0rqKXTNnk8OeDP5t9HQuFpmAbJi6vla"
          alt="Een optreden van de leden bij het kampvuur"
          width={300}
          height={300}
          className="absolute left-1/2 top-1/2 w-[200px] -translate-x-1/2 -translate-y-1/2 sm:w-[260px] md:w-[300px] lg:w-[220px] xl:w-[260px]"
          isVisible={isVisible}
          initialTransform="translate(-25%, 10%) rotate(16deg)"
        />
      </aside>
    </>
  );
}
