import Header3 from "~/components/typography/header3";
import Paragraph from "~/components/typography/paragraph";

interface ExplanationTextProps {
  title: string;
  children: React.ReactNode;
}

export default function ExplanationText({
  title,
  children,
}: ExplanationTextProps) {
  return (
    <div>
      <Header3>{title}</Header3>
      <Paragraph>{children}</Paragraph>
    </div>
  );
}
