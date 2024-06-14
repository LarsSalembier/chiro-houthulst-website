import { InfiniteMovingCards } from "~/components/ui/infinite-moving-cards";
import Image from "next/image";
import getSponsorsWithLogo from "./../../../_functions/get-sponsors-with-logo";

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

  const speed = sponsors.length > 10 ? "slow" : "normal";
  const widthAndHeight =
    minimumAmount > 50 ? (minimumAmount > 100 ? 300 : 200) : 150;

  return (
    <InfiniteMovingCards
      speed={speed}
      direction={direction}
      pauseOnHover={false}
      items={sponsors.map((sponsor) => {
        if (!sponsor.logoUrl) {
          throw new Error("Sponsor has no logo");
        } else {
          const image = (
            <Image
              key={sponsor.id}
              src={sponsor.logoUrl}
              alt={sponsor.companyName}
              width={widthAndHeight}
              height={widthAndHeight}
            />
          );

          if (sponsor.websiteUrl) {
            return (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="z-100"
              >
                {image}
              </a>
            );
          }
        }
      })}
    />
  );
}
