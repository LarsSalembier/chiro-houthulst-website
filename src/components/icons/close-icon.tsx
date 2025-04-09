import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function CloseIcon(props: IconProps) {
  return <BaseIcon {...props} svgPath={<path d="M18 6L6 18M6 6l12 12" />} />;
}
