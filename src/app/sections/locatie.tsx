import BlurFade from "~/components/animation/blur-fade";

export default function Locatie() {
  return (
    <section className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
      <div className="prose w-full md:prose-xl lg:max-w-[50%]">
        <BlurFade delay={0.15}>
          <h2>Waar vind je ons?</h2>
        </BlurFade>

        <BlurFade delay={0.2}>
          <p>
            Ons Chiroheem bevindt zich in de Jonkershovestraat 101S in
            Houthulst. De ingang bevindt zich rechts van de Carrefour.
          </p>
        </BlurFade>
      </div>
      <aside className="relative mt-8 flex w-full justify-center lg:justify-end">
        <iframe
          id="gmap_canvas"
          src="https://maps.google.com/maps?width=750&amp;height=400&amp;hl=nl-BE&amp;q=Chiro%20Houthulst&amp;t=h&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          className="h-96 w-full rounded-3xl"
        ></iframe>
      </aside>
    </section>
  );
}
