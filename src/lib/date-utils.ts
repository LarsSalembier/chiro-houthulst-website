import { CalendarDate } from "@internationalized/date";

export function formatDate(date: Date, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Formats a date in DD-MM-YYYY format consistently
 * This ensures the format is always DD-MM-YYYY regardless of locale settings
 */
export function formatDateDDMMYYYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Formats a date using toLocaleDateString with explicit options to ensure DD-MM-YYYY format
 */
export function formatDateLocale(date: Date, locale = "nl-BE"): string {
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Creates a CalendarDate from a Date object ensuring proper DD-MM-YYYY interpretation
 * This function ensures that the date is interpreted in DD-MM-YYYY format
 */
export function createCalendarDateFromDate(date: Date): CalendarDate {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1, // CalendarDate uses 1-indexed months
    date.getDate(),
  );
}

/**
 * Creates a Date object from a CalendarDate ensuring proper DD-MM-YYYY interpretation
 * This function ensures that the date is created in local timezone without timezone conversion issues
 */
export function createDateFromCalendarDate(calendarDate: CalendarDate): Date {
  // Extract year, month, day from CalendarDate
  const year = calendarDate.year;
  const month = calendarDate.month - 1; // Convert back to 0-indexed for Date constructor
  const day = calendarDate.day;

  // Create date in local timezone to avoid timezone conversion issues
  return new Date(year, month, day);
}
