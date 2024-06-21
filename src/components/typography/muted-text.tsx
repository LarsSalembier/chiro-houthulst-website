export default function MutedText({ children }: React.PropsWithChildren) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
