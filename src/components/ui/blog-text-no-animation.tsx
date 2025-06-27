import { type ReactNode } from "react";
import { cn } from "~/lib/cn";

interface BlogTextNoAnimationProps {
  className?: string;
  children: ReactNode;
}

export default function BlogTextNoAnimation({
  className,
  children,
}: BlogTextNoAnimationProps) {
  return (
    <div className={cn("prose w-full self-start md:prose-lg max-w-none", className)}>
      {children}
    </div>
  );
}
