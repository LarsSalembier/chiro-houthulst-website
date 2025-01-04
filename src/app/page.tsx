"use client";

import Chirozondagen from "./sections/chirozondagen";
import Events from "./sections/events";
import Hero from "./sections/hero";
import Locatie from "./sections/locatie";

export default function Home() {
  return (
    <>
      <Hero />
      <Chirozondagen />
      <Events />
      <Locatie />
    </>
  );
}
