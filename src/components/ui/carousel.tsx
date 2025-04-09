"use client";

import React, { createContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import ArrowLeftIcon from "~/components/icons/arrow-left-icon";
import ArrowRightIcon from "~/components/icons/arrow-right-icon";

interface CarouselContextType {
  onCardClose: (index: number) => void;
  currentIndex: number;
}

export const CarouselContext = createContext<CarouselContextType>({
  onCardClose: (_index: number): void => void 0,
  currentIndex: 0,
});

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  initialScroll?: number;
  cardWidth?: number;
  cardGap?: number;
  className?: string;
}

export function Carousel<T>({
  items,
  renderItem,
  initialScroll = 0,
  cardWidth = 384,
  cardGap = 8,
  className,
}: CarouselProps<T>) {
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
      carouselRef.current.scrollBy({
        left: -cardWidth - cardGap,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: cardWidth + cardGap,
        behavior: "smooth",
      });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const scrollPosition = (cardWidth + cardGap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className={`relative flex w-full flex-col gap-4 ${className ?? ""}`}>
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
                key={`carousel-item-${index}`}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            isIconOnly
            onPress={scrollLeft}
            isDisabled={!canScrollLeft}
            id="chirozondagen"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>
          <Button isIconOnly onPress={scrollRight} isDisabled={!canScrollRight}>
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
}
