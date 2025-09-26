import { type ReactNode } from "react";
import BlurFade from "../animation/blur-fade";
import { cn } from "~/lib/cn";

interface BlogTextProps {
  className?: string;
  children: ReactNode;
  maxWidth?: boolean;
}

export default function BlogText({
  className,
  children,
  maxWidth = true,
}: BlogTextProps) {
  return (
    <div
      className={cn(
        "prose w-full self-start md:prose-lg",
        maxWidth && "max-w-none",
        className,
      )}
    >
      <BlurFade delay={0.15}>{children}</BlurFade>
    </div>
  );
}
