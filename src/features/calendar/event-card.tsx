import { motion } from "framer-motion";
import { ImageCard } from "~/components/ui/image-card";
import { formatDate } from "~/lib/date-utils";

interface Event {
  src: string;
  title: string;
  date: Date;
  location: string;
}

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
        <div className="flex flex-col items-start">
          <motion.p
            layoutId={layout ? `date-${formatDate(event.date)}` : undefined}
            className="text-left text-base font-medium text-white md:text-lg"
          >
            {formatDate(event.date)}
          </motion.p>
          <motion.p
            layoutId={layout ? `location-${event.location}` : undefined}
            className="mt-1 text-left text-sm text-white/80 md:text-base"
          >
            {event.location}
          </motion.p>
        </div>
      }
    />
  );
}
