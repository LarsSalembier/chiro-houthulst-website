import { Link } from "@nextui-org/link";
import MailIcon from "../icons/mail-icon";
import { cn } from "@nextui-org/react";

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
      {...props}
      className={cn("flex items-center gap-1", className)}
    >
      <MailIcon size={20} />
      {address}
    </Link>
  );
}
