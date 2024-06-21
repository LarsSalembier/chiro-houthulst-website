import { Phone } from "lucide-react";

export default function PhoneNumber({ children }: React.PropsWithChildren) {
  return (
    <a href={`tel:${children}`} className="inline-flex items-center">
      <Phone className="mr-2 h-4 w-4" />
      <span>{children}</span>
    </a>
  );
}
