"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import Image from "next/image";
import {
  CalendarIcon,
  CheckCircle,
  XCircle,
  Euro,
  Tent,
  UserCheck,
  UserX,
  AlertTriangle,
} from "lucide-react";
import { type PaymentMethod } from "~/server/db/schema";
import {
  subscribeToCamp,
  unsubscribeFromCamp,
  markCampPaymentReceived,
} from "../actions";
import { formatDateLocale } from "~/lib/date-utils";
import { QRCodeModal } from "~/components/ui/qr-code-modal";

interface CampSubscriptionProps {
  memberId: number;
  workYearId: number;
  campPrice?: number | null;
  isSubscribed: boolean;
  paymentReceived: boolean;
  paymentMethod?: PaymentMethod | null;
  paymentDate?: Date | null;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Contant" },
  { value: "BANK_TRANSFER", label: "Overschrijving" },
  { value: "PAYCONIQ", label: "Payconiq" },
  { value: "OTHER", label: "Anders" },
];

export function CampSubscription({
  memberId,
  workYearId,
  campPrice,
  isSubscribed: initialIsSubscribed,
  paymentReceived: initialPaymentReceived,
  paymentMethod: initialPaymentMethod,
  paymentDate: initialPaymentDate,
}: CampSubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [paymentReceived, setPaymentReceived] = useState(
    initialPaymentReceived,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod | undefined
  >(initialPaymentMethod ?? undefined);
  const [paymentDate, setPaymentDate] = useState<Date | null>(
    initialPaymentDate ?? null,
  );
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<{
    src: string;
    title: string;
    altText: string;
    paymentInfo?: {
      amounts: string[];
      iban: string;
    };
  } | null>(null);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await subscribeToCamp(memberId, workYearId, selectedPaymentMethod);
      setIsSubscribed(true);
    } catch (error) {
      console.error("Error subscribing to camp:", error);
      // Could add a toast notification here instead of alert
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm("Weet je zeker dat je dit lid wilt uitschrijven voor kamp?")) {
      return;
    }

    setIsLoading(true);
    try {
      await unsubscribeFromCamp(memberId, workYearId);
      setIsSubscribed(false);
      setPaymentReceived(false);
      setPaymentDate(null);
    } catch (error) {
      console.error("Error unsubscribing from camp:", error);
      // Could add a toast notification here instead of alert
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentReceivedChange = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await markCampPaymentReceived(
        memberId,
        workYearId,
        checked,
        selectedPaymentMethod,
        checked ? new Date() : undefined,
      );
      setPaymentReceived(checked);
      setPaymentDate(checked ? new Date() : null);
    } catch (error) {
      console.error("Error updating payment status:", error);
      // Could add a toast notification here instead of alert
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return formatDateLocale(date);
  };

  const openQRModal = (
    src: string,
    title: string,
    altText: string,
    paymentInfo?: {
      amounts: string[];
      iban: string;
    },
  ) => {
    setQrModalData({ src, title, altText, paymentInfo });
    setQrModalOpen(true);
  };

  const closeQRModal = () => {
    setQrModalOpen(false);
    setQrModalData(null);
  };

  return (
    <Card>
      <CardHeader className="px-6 py-3">
        <div className="flex w-full items-center justify-between">
          <h2 className="flex min-w-0 flex-1 items-center gap-2 text-xl font-semibold text-blue-700">
            <Tent className="h-5 w-5 flex-shrink-0 text-blue-600" />
            <span className="truncate">Kampinschrijving</span>
          </h2>
          {campPrice && (
            <Chip
              color="primary"
              variant="flat"
              className="ml-4 flex-shrink-0 bg-blue-100 text-blue-800"
            >
              €{campPrice}
            </Chip>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-6">
        <div className="space-y-6">
          {/* Clear Subscription Status */}
          <div className="text-center">
            {isSubscribed ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-green-700">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <span className="text-lg font-semibold">
                    Ingeschreven voor kamp
                  </span>
                </div>
                {!paymentReceived && (
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <span className="text-lg font-semibold">
                      Betaling nog niet ontvangen
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <UserX className="h-8 w-8 text-gray-500" />
                  <span className="text-lg font-semibold">
                    Niet ingeschreven voor kamp
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Camp QR Code and Payment Info - Only show when subscribed but payment not received */}
          {isSubscribed && !paymentReceived && (
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/qr-code-chirokamp.png"
                alt="QR code voor kampinschrijving"
                className="h-32 w-32 cursor-pointer rounded-lg border object-contain shadow transition-shadow hover:shadow-lg"
                width={128}
                height={128}
                onClick={() =>
                  openQRModal(
                    "/qr-code-chirokamp.png",
                    "QR Code voor Kampinschrijving",
                    "QR code voor kampinschrijving",
                    {
                      amounts: [
                        "Bedrag: 175 EUR (eerste kind)",
                        "165 EUR (tweede kind)",
                      ],
                      iban: "BE71 0018 7690 8469",
                    },
                  )
                }
              />
              <div className="mt-2 text-center text-sm">
                <p className="font-medium text-gray-700">
                  Bedrag: 175 EUR (eerste kind)
                </p>
                <p className="font-medium text-gray-700">
                  165 EUR (tweede kind)
                </p>
                <p className="text-gray-600">BE71 0018 7690 8469</p>
              </div>
            </div>
          )}

          {/* Betalingsmethode - Only show if not subscribed or if no payment method selected */}
          {(!isSubscribed || !selectedPaymentMethod) && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Betalingsmethode
              </label>
              <Select
                selectedKeys={
                  selectedPaymentMethod ? [selectedPaymentMethod] : []
                }
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as PaymentMethod;
                  setSelectedPaymentMethod(selected);
                }}
                placeholder="Selecteer betalingsmethode"
                className="w-full"
              >
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value}>{method.label}</SelectItem>
                ))}
              </Select>
            </div>
          )}

          {/* Show selected payment method if subscribed */}
          {isSubscribed && selectedPaymentMethod && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">
                <strong>Betalingsmethode:</strong>{" "}
                {
                  PAYMENT_METHODS.find((m) => m.value === selectedPaymentMethod)
                    ?.label
                }
              </p>
            </div>
          )}

          {/* Betaling ontvangen checkbox */}
          {isSubscribed && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <Checkbox
                isSelected={paymentReceived}
                onValueChange={handlePaymentReceivedChange}
                isDisabled={isLoading}
                color="success"
                size="lg"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">
                  Betaling ontvangen
                </span>
                {paymentReceived && paymentDate && (
                  <p className="mt-1 text-xs text-gray-500">
                    Betaald op {formatDate(paymentDate)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Acties */}
          <div className="flex gap-2">
            {!isSubscribed ? (
              <Button
                color="primary"
                onPress={handleSubscribe}
                isLoading={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
                isDisabled={!selectedPaymentMethod}
              >
                Inschrijven voor kamp
              </Button>
            ) : (
              <Button
                color="default"
                variant="bordered"
                onPress={handleUnsubscribe}
                isLoading={isLoading}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                size="lg"
              >
                Uitschrijven
              </Button>
            )}
          </div>
        </div>
      </CardBody>

      {/* QR Code Modal */}
      {qrModalData && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={closeQRModal}
          qrCodeSrc={qrModalData.src}
          title={qrModalData.title}
          altText={qrModalData.altText}
          paymentInfo={qrModalData.paymentInfo}
        />
      )}
    </Card>
  );
}
