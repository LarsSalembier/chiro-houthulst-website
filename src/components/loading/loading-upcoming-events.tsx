import { Grid } from "../grid";
import {
  Section,
  SectionContent,
  SectionFooter,
  SectionTitle,
} from "../section";
import LoadingEventCard from "./loading-event-card";
import { Button } from "../ui/button";
import Link from "next/link";

export default function LoadingUpcomingEvents() {
  return (
    <Section id="aankomende-activiteiten">
      <SectionTitle>Aankomende activiteiten</SectionTitle>
      <SectionContent>
        <Grid>
          {[1, 2, 3].map((i) => (
            <LoadingEventCard key={i} />
          ))}
        </Grid>
      </SectionContent>
      <SectionFooter>
        <Button asChild className="w-fit">
          <Link href="/kalender">Bekijk de volledige kalender</Link>
        </Button>
      </SectionFooter>
    </Section>
  );
}
