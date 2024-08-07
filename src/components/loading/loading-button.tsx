import * as React from "react";

import { cn } from "~/lib/utils";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { type VariantProps } from "class-variance-authority";

export interface LoadingButtonProps
  extends React.BaseHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, variant, size, ...props }) => {
    return (
      <Skeleton
        className={cn(buttonVariants({ variant, size, className }), "w-28")}
        {...props}
      />
    );
  },
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
