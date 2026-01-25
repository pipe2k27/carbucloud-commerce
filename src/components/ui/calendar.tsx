"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CalendarProps = {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
};

function Calendar({
  selected,
  onSelect,
  disabled,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected || new Date()
  );

  const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (e: React.MouseEvent, day: Date) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled?.(day)) return;
    onSelect?.(day);
  };

  const isDisabled = (day: Date) => {
    return disabled?.(day) ?? false;
  };

  const today = startOfDay(new Date());

  return (
    <div className={cn("p-3", className)}>
      {/* Header */}
      <div className="flex justify-center pt-1 relative items-center mb-4">
        <Button
          variant="outline"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          onClick={handlePrevMonth}
          onMouseDown={(e) => e.preventDefault()}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </span>
        <Button
          variant="outline"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          onClick={handleNextMonth}
          onMouseDown={(e) => e.preventDefault()}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-muted-foreground text-center text-[0.8rem] font-normal w-9"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isToday = isSameDay(day, today);
          const isOutside = !isSameMonth(day, currentMonth);
          const dayDisabled = isDisabled(day);

          return (
            <Button
              key={day.toISOString()}
              variant="ghost"
              type="button"
              className={cn(
                "h-9 w-9 p-0 font-normal",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isToday && !isSelected && "bg-accent text-accent-foreground",
                isOutside && "text-muted-foreground opacity-50",
                dayDisabled && "text-muted-foreground opacity-50 cursor-not-allowed"
              )}
              disabled={dayDisabled}
              onClick={(e) => handleDayClick(e, day)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {format(day, "d")}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
