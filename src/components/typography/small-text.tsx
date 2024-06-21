export default function SmallText({ children }: React.PropsWithChildren) {
  return <p className="text-sm font-medium leading-none">{children}</p>;
}
