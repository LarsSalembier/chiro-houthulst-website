interface ParagraphProps {
  title: string;
  children: React.ReactNode;
}

export default function Paragraph({ title, children }: ParagraphProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      {children}
    </div>
  );
}
