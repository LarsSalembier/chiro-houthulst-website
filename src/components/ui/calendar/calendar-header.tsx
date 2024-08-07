import { format } from "date-fns/format";
import { nl } from "date-fns/locale";
import { Button } from "../button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isSameMonth } from "date-fns";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onTodayClick: () => void;
}

export default function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onTodayClick,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <h2 className="text-xl font-semibold">
        {format(currentMonth, "MMMM yyyy", { locale: nl })}
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Vorige maand</span>
        </Button>
        <Button
          variant="outline"
          onClick={onTodayClick}
          className="hidden md:inline-flex"
          disabled={isSameMonth(new Date(), currentMonth)}
        >
          Vandaag
        </Button>
        <Button variant="outline" size="icon" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Volgende maand</span>
        </Button>
      </div>
    </div>
  );
}
