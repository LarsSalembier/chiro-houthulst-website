import { motion } from "framer-motion";
import { ImageCard } from "~/components/ui/image-card";
import { formatDate } from "~/lib/date-utils";
import { Button } from "@heroui/button";
import type { Event } from "./event";

interface EventCardProps {
  event: Event;
  index: number;
  layout?: boolean;
}

export function EventCard({ event, index, layout = false }: EventCardProps) {
  return (
    <ImageCard
      title={event.title}
      imageSrc={event.src}
      index={index}
      footerContent={
        <div className="flex flex-col items-start space-y-1">
          <motion.p
            layoutId={layout ? `date-${formatDate(event.date)}` : undefined}
            className="text-left text-base font-medium text-white md:text-lg"
          >
            {formatDate(event.date)}
          </motion.p>
          {event.location && (
            <motion.p
              layoutId={layout ? `location-${event.location}` : undefined}
              className="text-left text-sm text-white/80 md:text-base"
            >
              📍 {event.location}
            </motion.p>
          )}
          {event.price && (
            <motion.p
              layoutId={layout ? `price-${event.price}` : undefined}
              className="text-left text-sm text-white/80 md:text-base"
            >
              💰 €{event.price}
            </motion.p>
          )}
          {event.canSignUp && (
            <motion.p
              layoutId={layout ? `signup-${event.title}` : undefined}
              className="text-left text-sm text-green-300 md:text-base"
            >
              ✓ Inschrijving mogelijk
            </motion.p>
          )}
          {event.facebookEventUrl && (
            <motion.div
              layoutId={layout ? `fb-button-${event.title}` : undefined}
              className="mt-2"
            >
              <Button
                as="a"
                href={event.facebookEventUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                className="text-xs md:text-sm"
              >
                Meer informatie
              </Button>
            </motion.div>
          )}
        </div>
      }
    />
  );
}
