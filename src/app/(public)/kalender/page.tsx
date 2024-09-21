// import { Button } from "~/components/ui/button";
// import Link from "next/link";
// import { type Metadata } from "next";
// import {
//   PageHeader,
//   PageHeaderHeading,
//   PageHeaderDescription,
//   PageActions,
// } from "~/components/page-header";
// import { Suspense } from "react";
// import LoadingCalendar from "./_calendar/loading-calendar";
// import CalendarWithData from "./calendar-with-data";

// export const metadata: Metadata = {
//   title: "Kalender",
//   description: "Kalender van Chiro Houthulst",
// };

// export default async function CalendarPage() {
//   return (
//     <div className="container relative flex flex-col gap-6">
//       <PageHeader>
//         <PageHeaderHeading>Onze kalender</PageHeaderHeading>
//         <PageHeaderDescription>
//           Bekijk hier onze kalender met alle activiteiten en evenementen.
//           Download de kalender om hem af te drukken.
//         </PageHeaderDescription>
//         <PageActions>
//           <Button asChild size="sm">
//             <Link
//               target="_blank"
//               rel="noreferrer"
//               href="kalender.jpg"
//               download="kalender.jpg"
//             >
//               Download afprintbare kalender
//             </Link>
//           </Button>
//         </PageActions>
//       </PageHeader>
//       <div className="pb-8 md:pb-12 lg:pb-12">
//         <Suspense fallback={<LoadingCalendar />}>
//           <CalendarWithData />
//         </Suspense>
//       </div>
//     </div>
//   );
// }
