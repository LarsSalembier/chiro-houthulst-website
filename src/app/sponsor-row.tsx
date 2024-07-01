import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";
import Image from "next/image";
import getSponsorsWithLogo from "./_functions/get-sponsors-with-logo";
import Link from "next/link";

interface SponsorRowProps {
  direction: "left" | "right";
  minimumAmount: number;
  maximumAmount: number;
}

export default async function SponsorRow({
  direction,
  minimumAmount,
  maximumAmount,
}: SponsorRowProps) {
  const sponsors = await getSponsorsWithLogo(minimumAmount, maximumAmount);

  // Determine card speed based on number of sponsors
  const speed = sponsors.length > 10 ? "slow" : "normal";

  // Calculate image dimensions based on sponsorship amount
  const imageDimensions =
    minimumAmount > 50 ? (minimumAmount > 100 ? 300 : 200) : 150;

  const sponsorCards = sponsors
    .filter((sponsor) => sponsor.logoUrl)
    .map((sponsor) => (
      <Link
        key={sponsor.id}
        href={sponsor.websiteUrl ?? "#"}
        target={sponsor.websiteUrl ? "_blank" : "_self"}
        rel={sponsor.websiteUrl ? "noopener noreferrer" : undefined}
        className="z-100"
      >
        <Image
          loading="eager"
          src={sponsor.logoUrl!}
          alt={sponsor.companyName}
          width={imageDimensions}
          height={imageDimensions}
        />
      </Link>
    ));

  return (
    <InfiniteMovingCards
      speed={speed}
      direction={direction}
      pauseOnHover={false}
      items={sponsorCards}
    />
  );
}
