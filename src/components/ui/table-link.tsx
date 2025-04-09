import { Link } from "@nextui-org/link";

interface TableLinkProps {
  children: React.ReactNode;
  href: string;
  isExternal?: boolean;
}

export default function TableLink({
  children,
  href,
  isExternal = false,
}: TableLinkProps) {
  return (
    <Link
      className="text-small"
      href={href}
      isExternal={isExternal}
      showAnchorIcon={isExternal}
    >
      {children}
    </Link>
  );
}
