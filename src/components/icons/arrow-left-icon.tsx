import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function ArrowLeftIcon(props: IconProps) {
  return <BaseIcon {...props} svgPath={<path d="M19 12H5M12 19l-7-7 7-7" />} />;
}
