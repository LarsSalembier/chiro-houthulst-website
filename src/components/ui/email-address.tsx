import { Link } from "@heroui/link";
import MailIcon from "../icons/mail-icon";
import { cn } from "@heroui/react";

interface EmailAddressProps {
  address: string;
  className?: string;
}

export default function EmailAddress({
  address,
  className,
  ...props
}: EmailAddressProps) {
  return (
    <Link
      href={`mailto:${address}`}
      className={cn("inline-flex gap-1 text-base md:text-lg", className)}
      {...props}
    >
      <MailIcon size={20} />
      {address}
    </Link>
  );
}
