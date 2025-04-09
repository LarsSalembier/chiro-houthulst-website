import { type ReactNode } from "react";
import BlurFade from "../animation/blur-fade";
import { cn } from "@heroui/react";

interface BlogTextProps {
  className?: string;
  children: ReactNode;
}

export default function BlogText({ className, children }: BlogTextProps) {
  return (
    <div className={cn("prose w-full self-start md:prose-lg", className)}>
      <BlurFade delay={0.15}>{children}</BlurFade>
    </div>
  );
}
