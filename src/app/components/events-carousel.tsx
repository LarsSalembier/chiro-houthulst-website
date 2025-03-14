"use client";
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import Image, { type ImageProps } from "next/image";
import {
  Card as HeroUICard,
  CardHeader,
  CardFooter,
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import ArrowLeftIcon from "~/components/icons/arrow-left-icon";
import ArrowRightIcon from "~/components/icons/arrow-right-icon";

interface CarouselProps {
  events: ChiroEvent[];
  initialScroll?: number;
}

type ChiroEvent = {
  src: string;
  title: string;
  date: Date;
  location: string;
};

interface CarouselContextType {
  onCardClose: (index: number) => void;
  currentIndex: number;
}

export const CarouselContext = createContext<CarouselContextType>({
  onCardClose: (_index: number): void => void 0,
  currentIndex: 0,
});

export const EventsCarousel = ({
  events: items,
  initialScroll = 0,
}: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative flex w-full flex-col gap-4">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"></div>

          <div className="flex flex-row justify-start gap-4">
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                <Card event={item} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button isIconOnly onPress={scrollLeft} isDisabled={!canScrollLeft}>
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>
          <Button isIconOnly onPress={scrollRight} isDisabled={!canScrollRight}>
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  event,
  index,
  layout = false,
}: {
  event: ChiroEvent;
  index: number;
  layout?: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    onClose();
    onCardClose(index);
  }, [index, onCardClose, onClose]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("nl-BE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="5xl"
        scrollBehavior="outside"
        backdrop="blur"
        classNames={{
          base: "bg-white dark:bg-neutral-900",
          header: "border-b-0",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalHeader>{event.title}</ModalHeader>
          <ModalBody>
            <BlurImage
              src={event.src}
              alt={event.title}
              height={600}
              width={1200}
              className="object-cover"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <HeroUICard
        isPressable
        onPress={onOpen}
        className="relative flex h-80 w-56 flex-col justify-between rounded-3xl p-6 md:h-[30rem] md:w-80"
      >
        <div className="absolute inset-x-0 top-0 z-10 h-1/2 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <CardHeader className="prose z-20 rounded-none p-0 text-start md:prose-xl">
          <h3 className="text-white">{event.title}</h3>
        </CardHeader>

        <CardFooter className="z-20 rounded-none p-0">
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
        </CardFooter>

        <BlurImage
          src={event.src}
          alt={event.title}
          fill
          className="absolute inset-0 object-cover"
        />
      </HeroUICard>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};
