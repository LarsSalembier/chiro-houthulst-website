import { Button } from "@heroui/button";
import { Link } from "@heroui/react";
import TrashIcon from "../icons/trash-icon";

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
      color="danger"
      as={href ? Link : "button"}
      endContent={isIconOnly ? <TrashIcon /> : undefined}
      onPress={onPress}
      size={size}
      isIconOnly={isIconOnly}
      aria-label={isIconOnly ? content : undefined}
      href={href}
    >
      {!isIconOnly && <TrashIcon />}
      {content}
    </Button>
  );
}
