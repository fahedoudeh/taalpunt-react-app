// src/helpers/utils.js

/** Ensure we always work with an array */
export const asArray = (maybeArray) =>
  Array.isArray(maybeArray) ? maybeArray : [];

/** Take the first `count` items (non-mutating) */
export const take = (array, count) => asArray(array).slice(0, count);

/** Safe text fallback */
export const orText = (value, fallbackText) =>
  (value ?? "").toString().trim() || fallbackText;

/**
 * Returns up to `limit` future (or today) items sorted by date ascending.
 * `dateKey` defaults to "date".
 */
export const getUpcomingByDate = (list, dateKey = "date", limit = 3) => {
  const items = Array.isArray(list) ? list : [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return items
    .map((it) => ({ ...it, __d: new Date(it?.[dateKey]) }))
    .filter((it) => it.__d.toString() !== "Invalid Date" && it.__d >= start)
    .sort((a, b) => a.__d - b.__d)
    .slice(0, limit);
};