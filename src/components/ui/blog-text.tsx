import { type ReactNode } from "react";
import BlurFade from "../animation/blur-fade";
import { cn } from "@nextui-org/react";

interface BlogTextProps {
  className?: string;
  children: ReactNode;
}

export default function BlogText({ className, children }: BlogTextProps) {
  return (
    <div className={cn("prose w-full self-start md:prose-xl", className)}>
      <BlurFade delay={0.15}>{children}</BlurFade>
    </div>
  );
}
