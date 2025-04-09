import React from "react";
import { type IconProps } from "./icon-props";

interface BaseIconProps extends IconProps {
  svgPath: React.ReactNode;
  viewBox?: string;
}

export default function BaseIcon({
  size = 24,
  width,
  height,
  strokeWidth = 1.5,
  color,
  svgPath,
  viewBox = "0 0 24 24",
  ...props
}: BaseIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox={viewBox}
      width={size ?? width}
      height={size ?? height}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      style={{
        ...(color && { stroke: color, fill: color }),
        ...props.style,
      }}
    >
      {svgPath}
    </svg>
  );
}
