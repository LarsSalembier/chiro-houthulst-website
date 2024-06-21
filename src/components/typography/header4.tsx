export default function Header4({
  children,
  id,
}: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h4
      className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0"
      id={id}
    >
      {children}
    </h4>
  );
}
