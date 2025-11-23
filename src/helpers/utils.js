/** Ensure to always work with an array */
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

export function sortByNewest(list, dateField = "createdAt") {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const da = a[dateField] ? new Date(a[dateField]).getTime() : 0;
    const db = b[dateField] ? new Date(b[dateField]).getTime() : 0;

    if (db !== da) return db - da;

    const ida = typeof a.id === "number" ? a.id : 0;
    const idb = typeof b.id === "number" ? b.id : 0;
    return idb - ida;
  });
}

// upcoming date/time (soonest first)
export function sortByUpcomingDateTime(
  list,
  dateField = "date",
  timeField = "startTime"
) {
  if (!Array.isArray(list)) return [];

  const now = new Date();

  return [...list]
    .map((item) => {
      const dateStr = item[dateField];
      if (!dateStr) return { item, ts: Infinity };

      // combine date + optional time to one timestamp
      const timeStr = item[timeField] || "00:00";
      const ts = new Date(`${dateStr}T${timeStr}`).getTime();
      return { item, ts: isNaN(ts) ? Infinity : ts };
    })
    .filter(({ ts }) => ts >= now.getTime()) // only future or now
    .sort((a, b) => a.ts - b.ts) // soonest first
    .map(({ item }) => item);
}
