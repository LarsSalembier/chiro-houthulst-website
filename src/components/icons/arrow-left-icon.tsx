import { type IconProps } from "./icons.types";

export default function ArrowLeftIcon({
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
        d="M19 12H5M12 19l-7-7 7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
