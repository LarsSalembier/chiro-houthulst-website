export default function OrderedList({ children }: React.PropsWithChildren) {
  return <ol className="ml-6 list-decimal py-6 [&>li]:mt-2">{children}</ol>;
}
