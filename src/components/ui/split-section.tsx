import { cn } from "@nextui-org/react";
import { type ReactNode } from "react";

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
        "flex w-full flex-col items-center justify-between gap-4 lg:flex-row lg:gap-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
