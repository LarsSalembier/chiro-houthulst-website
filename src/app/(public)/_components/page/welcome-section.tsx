import Image from "next/image";
import mainImage from "~/../public/kampgroepsfoto.png";

export default function WelcomeSection() {
  return (
    <section id="welkom" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={mainImage}
          alt="Chiro kinderen spelen"
          fill
          className="rounded-3xl object-cover"
          placeholder="blur"
          priority
        />
        <div
          className="absolute inset-0 rounded-3xl bg-black/50"
          aria-hidden="true"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-8 lg:py-48">
        <div className="grid max-w-3xl grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="z-10 lg:col-span-2">
            <h1 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl">
              Welkom bij Chiro Houthulst!
            </h1>
            <p className="text-lg leading-relaxed text-primary-foreground">
              De Chiro is de grootste jeugdbeweging van België. We brengen
              kinderen en jongeren samen, zonder onderscheid, en laten hen via
              spel ervaringen opdoen, samenleven en een kijk op zichzelf en de
              wereld ontwikkelen.
            </p>
          </div>
          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </section>
  );
}
