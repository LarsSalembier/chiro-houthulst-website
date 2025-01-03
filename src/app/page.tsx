"use client";

import Chirozondagen from "./sections/chirozondagen";
import { EventsCarousel } from "./sections/events-carousel";
import Hero from "./sections/hero";
import Locatie from "./sections/locatie";

export default function Home() {
  return (
    <>
      <Hero />
      <Chirozondagen />
      <EventsCarousel />
      <Locatie />
    </>
  );
}
