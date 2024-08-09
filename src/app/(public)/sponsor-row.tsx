import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";
import Image from "next/image";
import Link from "next/link";
import { getSponsors } from "~/server/queries/sponsor-queries";

interface SponsorRowProps {
  direction: "left" | "right";
  minAmount: number;
  maxAmount: number;
}

export default async function SponsorRow({
  direction,
  minAmount,
  maxAmount,
}: SponsorRowProps) {
  const sponsors = await getSponsors(minAmount, maxAmount);

  // Determine card speed based on number of sponsors
  const speed = sponsors.length > 10 ? "slow" : "normal";

  // Calculate image dimensions based on sponsorship amount
  const imageDimensions = minAmount > 50 ? (minAmount > 100 ? 300 : 200) : 150;

  const sponsorCards = sponsors.map((sponsor) => (
    <Link
      key={sponsor.id}
      href={sponsor.websiteUrl ?? "#"}
      target={sponsor.websiteUrl ? "_blank" : "_self"}
      rel={sponsor.websiteUrl ? "noopener noreferrer" : undefined}
      className="z-100"
    >
      <Image
        loading="eager"
        src={sponsor.logoUrl}
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
