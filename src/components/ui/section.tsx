import { cn } from "@nextui-org/react";
import { type ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section className={cn("w-full", className)} id={id}>
      <div className={cn("prose w-full pb-4 md:prose-xl", className)}>
        <h2 className="pb-2 pt-12">{title}</h2>
      </div>
      {children}
    </section>
  );
}
