import { cn } from "@nextui-org/react";

interface AddressProps extends React.HTMLAttributes<HTMLBaseElement> {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export default function Address({
  addressLine1,
  addressLine2,
  city,
  postalCode,
  country,
  className,
  ...props
}: AddressProps) {
  return (
    <address
      {...props}
      className={cn("font-semibold not-italic leading-none", className)}
    >
      {addressLine1 && <p>{addressLine1}</p>}
      {addressLine2 && <p>{addressLine2}</p>}
      {city && postalCode && (
        <p>
          {postalCode} {city}
        </p>
      )}
      {country && <p>{country}</p>}
    </address>
  );
}
