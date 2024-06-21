import NextLink from "next/link";

export default function Link({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <NextLink
      href={href}
      className="font-medium text-primary underline underline-offset-4"
    >
      {children}
    </NextLink>
  );
}
