import { type ReactNode } from "react";
import { cn } from "~/lib/cn";

interface AsideProps {
  children: ReactNode;
  className?: string;
}

export default function Aside({ children, className }: AsideProps) {
  return (
    <aside
      className={cn("flex w-full justify-center lg:justify-end", className)}
    >
      {children}
    </aside>
  );
}
