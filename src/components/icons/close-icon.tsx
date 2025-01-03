import { type IconProps } from "./icons.types";

export default function CloseIcon({
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
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
