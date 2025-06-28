"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import Image from "next/image";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeSrc: string;
  title: string;
  altText: string;
  paymentInfo?: {
    amounts: string[];
    iban: string;
  };
}

export function QRCodeModal({
  isOpen,
  onClose,
  qrCodeSrc,
  title,
  altText,
  paymentInfo,
}: QRCodeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody className="flex flex-col items-center justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={qrCodeSrc}
              alt={altText}
              width={300}
              height={300}
              className="rounded-lg border shadow-lg"
            />
            <p className="text-center text-sm text-gray-600">
              Scan deze QR code met je telefoon om de link te openen
            </p>
            {paymentInfo && (
              <div className="mt-4 text-center">
                {paymentInfo.amounts.map((amount, index) => (
                  <p key={index} className="text-sm font-medium text-gray-700">
                    {amount}
                  </p>
                ))}
                <p className="mt-2 text-sm text-gray-600">{paymentInfo.iban}</p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Sluiten
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
