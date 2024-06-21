export default function UnorderedList({ children }: React.PropsWithChildren) {
  return <ul className="ml-6 list-disc [&>li]:mt-2">{children}</ul>;
}
