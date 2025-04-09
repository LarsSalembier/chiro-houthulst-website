import { type ReactNode } from "react";
import { cn } from "~/lib/cn";

interface SplitSectionProps {
  className?: string;
  children: ReactNode;
}

export default function SplitSection({
  className,
  children,
}: SplitSectionProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col items-center justify-between gap-4 lg:flex-row lg:gap-8 lg:py-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
