import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function DownloadIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      svgPath={
        <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      }
    />
  );
}
