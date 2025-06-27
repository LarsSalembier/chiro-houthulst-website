import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function ChevronDownIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      svgPath={
        <path
          d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
          strokeMiterlimit={10}
        />
      }
    />
  );
}
