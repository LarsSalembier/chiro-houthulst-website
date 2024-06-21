export default function KeyboardInput({ children }: React.PropsWithChildren) {
  return (
    <kbd className="rounded border bg-muted px-1 font-mono text-sm font-semibold">
      {children}
    </kbd>
  );
}
