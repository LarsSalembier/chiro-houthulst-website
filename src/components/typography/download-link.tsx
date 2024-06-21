import { Download } from "lucide-react";
import NextLink from "next/link";

export default function DownloadLink({
  href,
  fileName,
  children,
}: React.PropsWithChildren<{ href: string; fileName?: string }>) {
  return (
    <div className="inline-block">
      <NextLink
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        download={fileName}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="mr-1 inline-block h-4 w-4" />
        {children}
      </NextLink>
    </div>
  );
}
