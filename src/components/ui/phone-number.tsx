import { Link } from "@heroui/link";
import PhoneIcon from "../icons/phone-icon";
import { cn } from "~/lib/cn";

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
      className={cn("flex items-center gap-1 text-base md:text-lg", className)}
    >
      <PhoneIcon size={18} />
      {number}
    </Link>
  );
}
