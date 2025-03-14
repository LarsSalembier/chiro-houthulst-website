import { useEffect, useState } from "react";
import BlurFade from "~/components/animation/blur-fade";
import HeroImage from "../components/hero-image";

export default function Chirozondagen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex w-full flex-col items-center justify-between lg:flex-row">
      <aside className="relative mt-8 flex min-h-[400px] w-full justify-center sm:min-h-[500px] md:min-h-[650px] lg:min-h-[600px] lg:justify-end xl:min-h-[600px]">
        <HeroImage
          src="https://utfs.io/f/9igZHUjyeBOxaBH6J4oXDhskiH8OxmF37l2ceQIw5LuRqYWZ"
          alt="Openingsformatie van de Chiro"
          width={490}
          height={259}
          className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 sm:w-[400px] md:w-[480px] lg:w-[360px] xl:w-[460px]"
          isVisible={isVisible}
          initialTransform="translate(-70%, -50%) rotate(-5deg)"
        />
      </aside>
      <div className="prose md:prose-xl w-full lg:max-w-[50%]">
        <BlurFade delay={0.15}>
          <h2>Chirozondagen</h2>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p>
            Elke zondag van 14u tot 17u komen we samen in de Chiro voor een
            middag vol spel, creativiteit en plezier. Onze enthousiaste leiding
            staat altijd klaar om de leukste activiteiten te organiseren,
            aangepast aan de verschillende leeftijden.
          </p>
        </BlurFade>

        <BlurFade delay={0.25}>
          <p>
            Ben je nieuwsgierig en wil je eens proeven van de Chiro? Kom gerust
            een kijkje nemen op zondag. Iedereen is welkom, of je nu voor de
            eerste keer komt of al jaren meedraait!
          </p>
        </BlurFade>
      </div>
    </section>
  );
}
