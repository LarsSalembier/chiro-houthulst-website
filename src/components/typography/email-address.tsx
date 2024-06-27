import { Mail } from "lucide-react";
import NextLink from "next/link";

export default function EmailAddress({ address }: { address: string }) {
  return (
    <span>
      <NextLink
        href={`mailto:${address}`}
        className="font-medium text-primary underline underline-offset-4"
      >
        <Mail className="mr-1 inline-block h-4 w-4" />
        {address}
      </NextLink>
    </span>
  );
}
