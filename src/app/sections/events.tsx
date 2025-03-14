"use client";
import React from "react";
import { EventsCarousel } from "~/app/components/events-carousel";

export default function Events() {
  return (
    <section className="w-full">
      <div className="prose md:prose-xl mb-8">
        <h2>Volgende Activiteiten</h2>
      </div>
      <EventsCarousel events={events} />
    </section>
  );
}

const events = [
  {
    title: "Afdelingsweekend Speelclub",
    date: new Date("2024-02-16"),
    location: "Jeugdverblijf De Karmel, Brugge",
    src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80",
  },
  {
    title: "Startdag Chiro",
    date: new Date("2024-09-15"),
    location: "Chirolokaal & Speelplein",
    src: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80",
  },
  {
    title: "Spaghettiavond",
    date: new Date("2024-03-23"),
    location: "Parochiezaal",
    src: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&q=80",
  },
  {
    title: "Chirokamp 2024",
    date: new Date("2024-07-21"),
    location: "Kampplaats Westouter",
    src: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80",
  },
  {
    title: "Leidingsweekend",
    date: new Date("2024-04-19"),
    location: "De Hoge Rielen, Kasterlee",
    src: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&q=80",
  },
  {
    title: "Groepsfeest",
    date: new Date("2024-05-25"),
    location: "Sporthal",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
  },
  {
    title: "Aspiweekend",
    date: new Date("2024-03-08"),
    location: "Jeugdverblijf Hoogstade",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
  },
  {
    title: "Dia-avond Kamp",
    date: new Date("2024-09-28"),
    location: "Chirolokaal",
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80",
  },
];
