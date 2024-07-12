import { cn } from "~/lib/utils";
import { Header2 } from "./typography/headers";

export function Section({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionTitle({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Header2 {...props}>{children}</Header2>;
}

export function SectionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}

export function SectionFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}
