import type { SVGAttributes } from "react";

export type IconProps = Omit<
  SVGAttributes<SVGSVGElement>,
  "color" | "height" | "width"
> & {
  size?: string | number;
  width?: string | number;
  height?: string | number;
  strokeWidth?: string | number;
  color?: string;
};
