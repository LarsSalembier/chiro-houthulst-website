export default function Preformatted({ children }: React.PropsWithChildren) {
  return <pre className="whitespace-pre font-mono">{children}</pre>;
}
