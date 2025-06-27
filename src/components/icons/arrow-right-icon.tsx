import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function ArrowRightIcon(props: IconProps) {
  return <BaseIcon {...props} svgPath={<path d="M5 12h14M12 5l7 7-7 7" />} />;
}
