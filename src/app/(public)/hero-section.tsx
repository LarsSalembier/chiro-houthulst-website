import { cn } from "~/lib/utils";
import Image, { type StaticImageData } from "next/image";

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  src: StaticImageData;
  alt: string;
}

export function HeroSection({
  children,
  src,
  alt,
  ...props
}: HeroSectionProps) {
  return (
    <section {...props}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            className="rounded-3xl object-cover"
            placeholder="blur"
            priority
            {...props}
          />
          <div
            className="absolute inset-0 rounded-3xl bg-black/50"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-2 px-6 py-24 text-primary-foreground md:py-32 lg:px-8 lg:py-48">
          {children}
        </div>
      </div>
    </section>
  );
}

export function HeroSectionTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold leading-tight tracking-tighter text-primary-foreground md:text-4xl lg:leading-[1.1] xl:text-5xl",
        className,
      )}
      {...props}
    />
  );
}

export function HeroSectionDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-2xl text-balance text-lg text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}
