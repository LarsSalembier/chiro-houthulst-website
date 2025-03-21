import { Link } from "@nextui-org/link";
import PhoneIcon from "../icons/phone-icon";
import { cn } from "@nextui-org/react";

interface PhoneNumberProps {
  number: string;
  className?: string;
}

export default function PhoneNumber({
  number,
  className,
  ...props
}: PhoneNumberProps) {
  return (
    <Link
      href={`tel:${number}`}
      {...props}
      className={cn("flex items-center gap-1", className)}
    >
      <PhoneIcon size={18} />
      {number}
    </Link>
  );
}
