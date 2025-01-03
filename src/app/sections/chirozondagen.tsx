import BlurFade from "~/components/animation/blur-fade";

export default function Chirozondagen() {
  return (
    <section className="w-full py-16">
      <BlurFade delay={0.15}>
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Chirozondagen
        </h2>
      </BlurFade>

      <BlurFade delay={0.2}>
        <p className="max-w-prose text-lg leading-relaxed opacity-80 sm:text-xl">
          Elke zondag van 14u tot 17u komen we samen in de Chiro voor een middag
          vol spel, creativiteit en plezier. Onze enthousiaste leiding staat
          altijd klaar om de leukste activiteiten te organiseren, aangepast aan
          de verschillende leeftijden.
        </p>
      </BlurFade>

      <BlurFade delay={0.25}>
        <p className="mt-4 max-w-prose text-lg leading-relaxed opacity-80 sm:text-xl">
          Ben je nieuwsgierig en wil je eens proeven van de Chiro? Kom gerust
          een kijkje nemen op zondag. Iedereen is welkom, of je nu voor de
          eerste keer komt of al jaren meedraait!
        </p>
      </BlurFade>
    </section>
  );
}
