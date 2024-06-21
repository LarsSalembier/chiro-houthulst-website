import Link from "next/link";
import Header3 from "~/components/typography/header3";
import Paragraph from "~/components/typography/paragraph";
import { Button } from "~/components/ui/button";

interface ExplanationTextProps {
  title: string;
  children: React.ReactNode;
  link?: string;
  linkText?: string;
}

export default function ExplanationText({
  title,
  children,
  link,
  linkText,
}: ExplanationTextProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Header3 id={title.toLowerCase()}>{title}</Header3>
        <Paragraph>{children}</Paragraph>
      </div>
      {link && (
        <Button asChild className="w-fit">
          <Link href={link}>{linkText || "Lees meer"}</Link>
        </Button>
      )}
    </div>
  );
}
