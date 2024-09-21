// import { Grid } from "~/components/grid";
// import { getUpcomingEvents } from "~/server/queries/event-queries";
// import EventCard from "./event-card";
// import {
//   Section,
//   SectionContent,
//   SectionFooter,
//   SectionTitle,
// } from "~/components/section";
// import AddEventDialog from "~/components/dialogs/add-event-dialog";
// import { Button } from "~/components/ui/button";
// import Link from "next/link";
// import { isLeiding } from "~/lib/auth";

// export default async function UpcomingEvents() {
//   const upcomingEvents = await getUpcomingEvents(3);

//   return (
//     <Section id="aankomende-activiteiten">
//       <SectionTitle>Aankomende activiteiten</SectionTitle>
//       <SectionContent>
//         <Grid>
//           {upcomingEvents.map((event) => (
//             <EventCard event={event} key={event.id} />
//           ))}
//         </Grid>
//       </SectionContent>
//       <SectionFooter className="flex flex-row gap-2">
//         <Button asChild className="w-fit">
//           <Link href="/kalender">Bekijk de volledige kalender</Link>
//         </Button>
//         {isLeiding() && (
//           <AddEventDialog
//             lastAddedEvent={upcomingEvents[0]}
//             startDate={new Date()}
//             className="h-10 w-10 self-start bg-secondary text-secondary-foreground lg:h-10 lg:w-10"
//           />
//         )}
//       </SectionFooter>
//     </Section>
//   );
// }
