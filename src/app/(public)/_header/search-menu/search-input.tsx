import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SearchInputProps {
  openDialog: () => void;
}

export default function SearchInput({ openDialog }: SearchInputProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
      )}
      onClick={openDialog}
    >
      <span className="hidden lg:inline-flex">Zoek op de website...</span>
      <span className="inline-flex lg:hidden">Zoeken...</span>
    </Button>
  );
}
