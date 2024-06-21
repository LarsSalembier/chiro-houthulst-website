export default function CodeBlock({ children }: React.PropsWithChildren) {
  return (
    <pre className="mt-6 rounded-md bg-muted p-4 font-mono text-sm">
      {children}
    </pre>
  );
}
