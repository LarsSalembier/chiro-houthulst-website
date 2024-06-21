export default function Deleted({ children }: React.PropsWithChildren) {
  return <del className="text-muted-foreground">{children}</del>;
}
