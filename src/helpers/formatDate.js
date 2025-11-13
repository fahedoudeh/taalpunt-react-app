// src/helpers/formatDate.js

/**
 * formatDate(inputValue, withTime = true)
 * - inputValue: Date | ISO string | timestamp
 * - returns e.g. "do 13-11-2025 14:05" (nl-NL)
 */
export const formatDate = (inputValue, withTime = true) => {
  if (!inputValue) return "";
  const dateObj =
    typeof inputValue === "string" || typeof inputValue === "number"
      ? new Date(inputValue)
      : inputValue;

  if (Number.isNaN(dateObj.getTime())) return "";

  const dateStr = new Intl.DateTimeFormat("nl-NL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(dateObj)
    .replace(",", "");

  if (!withTime) return dateStr;

  const timeStr = new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);

  return `${dateStr} ${timeStr}`;
};

/** Short format: "13-11-2025" */
export const formatDateShort = (inputValue) => {
  if (!inputValue) return "";
  const dateObj =
    typeof inputValue === "string" || typeof inputValue === "number"
      ? new Date(inputValue)
      : inputValue;

  if (Number.isNaN(dateObj.getTime())) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
};
