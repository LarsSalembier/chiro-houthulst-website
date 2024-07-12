import { Download, Mail, Phone } from "lucide-react";
import NextLink from "next/link";
import { cn } from "~/lib/utils";

interface FormattedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function FormattedLink({
  href,
  children,
  className,
  ...props
}: FormattedLinkProps) {
  return (
    <NextLink
      href={href}
      className={cn(
        "font-medium text-primary underline underline-offset-4",
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}

interface EmailAddressProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  address: string;
}

export function EmailAddress({
  address,
  className,
  ...props
}: EmailAddressProps) {
  return (
    <a
      href={`mailto:${address}`}
      className={cn(
        "inline-flex items-center font-medium text-primary underline underline-offset-4",
        className,
      )}
      {...props}
    >
      <Mail className="mr-1 h-4 w-4" />
      <span>{address}</span>
    </a>
  );
}

interface PhoneNumberProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  number: string;
}

export function PhoneNumber({ number, className, ...props }: PhoneNumberProps) {
  return (
    <a
      href={`tel:${number}`}
      className={cn("inline-flex items-center", className)}
      {...props}
    >
      <Phone className="mr-1 h-4 w-4" />
      <span>{number}</span>
    </a>
  );
}

interface DownloadLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  fileName: string;
  href: string;
}

export function DownloadLink({
  children,
  className,
  href,
  fileName,
  ...props
}: DownloadLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center font-medium text-primary underline underline-offset-4",
        className,
      )}
      download={fileName}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      <Download className="mr-1 h-4 w-4" />
      <span>{children}</span>
    </a>
  );
}
