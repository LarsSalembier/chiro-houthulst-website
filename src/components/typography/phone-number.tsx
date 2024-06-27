import { Phone } from "lucide-react";

export default function PhoneNumber({ number }: { number: string }) {
  return (
    <a href={`tel:${number}`} className="inline-flex items-center">
      <Phone className="mr-2 h-4 w-4" />
      <span>{number}</span>
    </a>
  );
}
