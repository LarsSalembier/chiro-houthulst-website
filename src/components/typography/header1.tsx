export default function Header1({
  children,
  id,
}: React.PropsWithChildren<{ id?: string }>) {
  return (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
      id={id}
    >
      {children}
    </h1>
  );
}
