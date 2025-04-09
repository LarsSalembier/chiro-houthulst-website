import { Button } from "@heroui/button";
import PlusIcon from "../icons/plus-icon";
import { Link } from "@heroui/react";

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
      color="primary"
      endContent={isIconOnly ? <PlusIcon /> : undefined}
      onPress={onPress}
      size={size}
      isIconOnly={isIconOnly}
      aria-label={isIconOnly ? content : undefined}
      href={href}
    >
      {!isIconOnly && <PlusIcon />}
      {content}
    </Button>
  );
}
