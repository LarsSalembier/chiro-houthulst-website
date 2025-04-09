import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
import EditIcon from "../icons/edit-icon";

interface CreateButtonProps {
  onPress?: () => void;
  content: string;
  size?: "sm" | "md" | "lg";
  isIconOnly?: boolean;
  href?: string;
}

export default function CreateButton({
  onPress,
  content,
  size = "md",
  isIconOnly,
  href,
}: CreateButtonProps) {
  return (
    <Button
      as={href ? Link : "button"}
      endContent={isIconOnly ? <EditIcon /> : undefined}
      onPress={onPress}
      size={size}
      isIconOnly={isIconOnly}
      aria-label={isIconOnly ? content : undefined}
      href={href}
    >
      {!isIconOnly && <EditIcon />}
      {content}
    </Button>
  );
}
