import { Mail } from "lucide-react";

export default function EmailAddress({ children }: React.PropsWithChildren) {
  return (
    <a href={`mailto:${children}`} className="inline-flex items-center">
      <Mail className="mr-2 h-4 w-4" />
      <span className="underline">{children}</span>
    </a>
  );
}
