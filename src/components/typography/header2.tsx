export default function Header2({
  children,
  id,
}: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h2
      className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      id={id}
    >
      {children}
    </h2>
  );
}
