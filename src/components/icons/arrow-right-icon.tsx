import { type IconProps } from "./icons.types";

export default function ArrowRightIcon({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: IconProps) {
  return (
    <svg
      fill="none"
      height={height ?? size}
      viewBox="0 0 24 24"
      width={width ?? size}
      {...props}
    >
      <path
        d="M5 12h14M12 5l7 7-7 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
