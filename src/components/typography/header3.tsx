export default function Header3({
  children,
  id,
}: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h3
      className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0"
      id={id}
    >
      {children}
    </h3>
  );
}
