import React from "react";
import { cn } from "~/lib/utils";

export function Grid({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-9",
        className,
      )}
    >
      {children}
    </div>
  );
}

// interface GridSectionProps {
//   id: string;
//   title: string;
//   children: React.ReactNode;
//   footer?: React.ReactNode;
// }

// export default function GridSection({
//   id,
//   title,
//   children,
//   footer,
// }: GridSectionProps) {
//   return (
//     <section id={id} className="flex flex-col">
//       <Header2>{title}</Header2>
//       <div className="mt-6 flex flex-col gap-6">
//         <div className=" grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-9">
//           {children}
//         </div>
//         {footer}
//       </div>
//     </section>
//   );
// }
