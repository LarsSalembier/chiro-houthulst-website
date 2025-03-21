export function formatDate(date: Date, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatShortDate(date: Date, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatTime(date: Date, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
