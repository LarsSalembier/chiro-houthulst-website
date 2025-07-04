import BaseIcon from "./base-icon";
import { type IconProps } from "./icon-props";

export default function EditIcon(props: IconProps) {
  return (
    <BaseIcon
      {...props}
      svgPath={
        <>
          <path d="M13.3352 19.5078H19.7122" />

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.0578 4.85889V4.85889C14.7138 3.85089 12.8078 4.12289 11.7998 5.46589C11.7998 5.46589 6.78679 12.1439 5.04779 14.4609C3.30879 16.7789 4.95379 19.6509 4.95379 19.6509C4.95379 19.6509 8.19779 20.3969 9.91179 18.1119C11.6268 15.8279 16.6638 9.11689 16.6638 9.11689C17.6718 7.77389 17.4008 5.86689 16.0578 4.85889Z"
          />

          <path d="M10.5042 7.21143L15.3682 10.8624" />
        </>
      }
    />
  );
}
