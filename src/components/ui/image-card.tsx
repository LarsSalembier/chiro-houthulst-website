"use client";
import { useCallback, useContext, useState } from "react";
import Image, { type ImageProps } from "next/image";
import {
  Card,
  CardHeader,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  cn,
} from "@nextui-org/react";
import { CarouselContext } from "./carousel";

interface ImageCardProps {
  title: string;
  imageSrc: string;
  index: number;
  footerContent?: React.ReactNode;
  layout?: boolean;
  className?: string;
  imageClassName?: string;
}

export function ImageCard({
  title,
  imageSrc,
  index,
  footerContent,
  className = "",
  imageClassName = "",
}: ImageCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    onClose();
    onCardClose(index);
  }, [index, onCardClose, onClose]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="2xl"
        scrollBehavior="outside"
        backdrop="blur"
        classNames={{
          wrapper: "duration-300 cubic-bezier",
          header: "border-b-0",
          body: "p-0",
        }}
      >
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <Image
              src={imageSrc}
              alt={title}
              height={300}
              width={700}
              className="max-h-96 rounded-b-xl object-cover"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Card
        isPressable
        onPress={onOpen}
        className={`relative flex h-80 w-56 flex-col justify-between rounded-3xl p-6 md:h-[30rem] md:w-80 ${className}`}
      >
        <div className="absolute inset-x-0 top-0 z-10 h-1/2 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <CardHeader className="prose z-20 rounded-none p-0 text-start md:prose-xl">
          <h3 className="text-white">{title}</h3>
        </CardHeader>

        <CardFooter className="z-20 rounded-none p-0">
          {footerContent}
        </CardFooter>

        <Image
          src={imageSrc}
          alt={title}
          fill
          className={`absolute inset-0 object-cover ${imageClassName}`}
        />
      </Card>
    </>
  );
}
