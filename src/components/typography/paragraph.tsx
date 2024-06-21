export default function Paragraph({ children }: React.PropsWithChildren) {
  return <p className="[&:not(:first-child)]:mt-5 ">{children}</p>;
}
