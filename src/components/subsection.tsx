import { Header3 } from "./typography/headers";
import { cn } from "~/lib/utils";

export function Subsection({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("flex flex-col gap-3", className)} {...props}>
      {children}
    </section>
  );
}

export function SubsectionTitle({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Header3 {...props}>{children}</Header3>;
}

export function SubsectionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("flex flex-col gap-3", className)}>
      {children}
    </div>
  );
}

export function SubsectionFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("flex flex-col gap-3", className)}>
      {children}
    </div>
  );
}
