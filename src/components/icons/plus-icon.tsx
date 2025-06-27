import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function PlusIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      svgPath={
        <>
          <path d="M6 12h12" />

          <path d="M12 18V6" />
        </>
      }
    />
  );
}
