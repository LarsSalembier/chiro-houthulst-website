// import { cn } from "~/lib/utils";
// import { type Event } from "drizzle/schema";
// import { getEventTypeColors } from "./calendar-utils";

// interface DayEventsListProps {
//   events: Event[];
// }

// export default function DayEventsList({ events }: DayEventsListProps) {
//   return (
//     <ul className="hidden flex-col gap-2 lg:flex" role="list">
//       {events.map((event) => (
//         <li key={event.id}>
//           <div
//             className={cn(
//               "max-w-fit overflow-hidden overflow-ellipsis whitespace-nowrap text-nowrap rounded-md px-2 py-1 text-xs font-medium",
//               getEventTypeColors(event.eventType),
//             )}
//           >
//             {event.title}
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }
