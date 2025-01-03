"use client";
import React from "react";
import { Carousel } from "~/components/ui/cards-carousel";

export function EventsCarousel() {
  return (
    <section className="w-full pb-16">
      <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
        Activiteiten
      </h2>
      <Carousel items={events} />
    </section>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array<number>(1).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="mb-4 rounded-3xl bg-[#F5F5F7] p-8 dark:bg-neutral-800 md:p-14"
          >
            <p className="mx-auto max-w-3xl font-sans text-base text-neutral-600 dark:text-neutral-400 md:text-2xl">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                Wanneer: 14 december 2024, 14:00 - 17:00
              </span>{" "}
              Kom samen met je afdeling genieten van een super leuke activiteit!
              Vergeet zeker geen vieruurtje en drinkbus mee te nemen. Locatie:
              Chirolokaal Houthulst
            </p>
          </div>
        );
      })}
    </>
  );
};

const events = [
  {
    title: "Afdelingsweekend Speelclub",
    date: new Date("2024-02-16"),
    location: "Jeugdverblijf De Karmel, Brugge",
    src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
  {
    title: "Startdag Chiro",
    date: new Date("2024-09-15"),
    location: "Chirolokaal & Speelplein",
    src: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
  {
    title: "Spaghettiavond",
    date: new Date("2024-03-23"),
    location: "Parochiezaal",
    src: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
  {
    title: "Chirokamp 2024",
    date: new Date("2024-07-21"),
    location: "Kampplaats Westouter",
    src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
  {
    title: "Leidingsweekend",
    date: new Date("2024-04-19"),
    location: "De Hoge Rielen, Kasterlee",
    src: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
  {
    title: "Groepsfeest",
    date: new Date("2024-05-25"),
    location: "Sporthal",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
  {
    title: "Aspiweekend",
    date: new Date("2024-03-08"),
    location: "Jeugdverblijf Hoogstade",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
  {
    title: "Dia-avond Kamp",
    date: new Date("2024-09-28"),
    location: "Chirolokaal",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
    content: <DummyContent />,
  },
];
