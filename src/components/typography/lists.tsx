import { cn } from "~/lib/utils";

export function OrderedList({
  children,
  className,
  ...props
}: React.OlHTMLAttributes<HTMLOListElement>) {
  return (
    <ol className={cn("ml-6 list-decimal space-y-2", className)} {...props}>
      {children}
    </ol>
  );
}

export function UnorderedList({
  children,
  className,
  ...props
}: React.OlHTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("ml-6 list-disc space-y-2", className)} {...props}>
      {children}
    </ul>
  );
}
