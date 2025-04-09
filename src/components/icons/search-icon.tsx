import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function SearchIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      svgPath={
        <>
          <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" />
          <path d="M22 22L20 20" />
        </>
      }
    />
  );
}
