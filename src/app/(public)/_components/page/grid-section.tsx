import React from "react";

type Props = {
  id: string;
  title: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
};

export default function GridSection({ id, title, content, footer }: Props) {
  return (
    <section id={id} className="flex flex-col gap-4 xl:gap-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex flex-col gap-6">
        <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-9">
          {content}
        </div>
        {footer}
      </div>
    </section>
  );
}
