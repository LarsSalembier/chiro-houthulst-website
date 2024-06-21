export default function Abbreviation({
  children,
  title,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <abbr className="cursor-help decoration-1 underline-offset-2" title={title}>
      {children}
    </abbr>
  );
}
