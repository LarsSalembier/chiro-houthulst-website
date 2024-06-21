import { Mail } from "lucide-react";
import NextLink from "next/link";

export default function EmailAddress({ children }: React.PropsWithChildren) {
  return (
    <div className="inline-block">
      <NextLink
        href={`mailto:${children}`}
        className="font-medium text-primary underline underline-offset-4"
      >
        <Mail className="mr-1 inline-block h-4 w-4" />
        {children}
      </NextLink>
    </div>
  );
}
