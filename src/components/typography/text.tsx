import { cn } from "~/lib/utils";

export function MutedText({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function Strong({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("font-semibold", className)} {...props}>
      {children}
    </span>
  );
}

export function Paragraph({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("[&:not(:first-child)]:mt-5", className)} {...props}>
      {children}
    </p>
  );
}
