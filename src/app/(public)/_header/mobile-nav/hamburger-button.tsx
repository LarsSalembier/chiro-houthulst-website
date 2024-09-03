import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";

export default function HamburgerButton() {
  return (
    <Button
      variant="ghost"
      className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
    >
      <Icons.Hamburger className="h-5 w-5" />
      <span className="sr-only">Menu openen</span>
    </Button>
  );
}
