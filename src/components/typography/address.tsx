interface AddressProps {
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export default function Address({
  streetAddress,
  streetAddress2,
  city,
  postalCode,
  country,
}: AddressProps) {
  return (
    <address className="font-medium not-italic [&:not(:first-child)]:mt-5">
      {streetAddress && <p>{streetAddress}</p>}
      {streetAddress2 && <p>{streetAddress2}</p>}
      {city && postalCode && (
        <p>
          {postalCode} {city}
        </p>
      )}
      {country && <p>{country}</p>}
    </address>
  );
}
