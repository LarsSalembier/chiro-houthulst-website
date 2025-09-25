"use client";

import { Section } from "~/components/ui/section";
import { Carousel } from "~/components/ui/carousel";
import { EventCard } from "~/features/calendar/event-card";
import type { Event } from "~/features/calendar/event";

interface CalendarSectionProps {
  events: Event[];
}

export default function CalendarSection({ events }: CalendarSectionProps) {
  return (
    <Section title="Kalender" id="kalender">
      <Carousel
        items={events}
        renderItem={(event, index) => (
          <EventCard event={event} index={index} />
        )}
        cardWidth={320}
        cardGap={16}
      />
    </Section>
  );
}
