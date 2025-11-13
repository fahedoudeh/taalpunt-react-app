// src/helpers/utils.js

/** Ensure we always work with an array */
export const asArray = (maybeArray) =>
  Array.isArray(maybeArray) ? maybeArray : [];

/** Take the first `count` items (non-mutating) */
export const take = (array, count) => asArray(array).slice(0, count);

/** Safe text fallback */
export const orText = (value, fallbackText) =>
  (value ?? "").toString().trim() || fallbackText;
