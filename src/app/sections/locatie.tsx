import BlurFade from "~/components/animation/blur-fade";

export default function Locatie() {
  return (
    <section className="w-full pb-16">
      <BlurFade delay={0.15}>
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Waar vind je ons?
        </h2>
      </BlurFade>

      <BlurFade delay={0.2}>
        <p className="max-w-prose text-lg leading-relaxed opacity-80 sm:text-xl">
          Onze lokalen bevinden zich in de Jonkershovestraat 101S in Houthulst.
        </p>
      </BlurFade>
    </section>
  );
}
