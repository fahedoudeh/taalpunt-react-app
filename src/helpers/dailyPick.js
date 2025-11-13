// Bepaalt elke dag deterministisch een item uit een lijst.
// Zo ziet iedereen dezelfde "van de dag" zonder opslag of externe API.

const pad = (num) => (num < 10 ? `0${num}` : `${num}`);

export const getDayOfYear = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start; // ms
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneDay) + 1; // 1..366
};

export const dailySeed = (date = new Date()) => {
  const y = date.getFullYear();
  const doy = getDayOfYear(date);
  // Simpele, stabiele seed; verander formule = andere volgorde
  return Number(`${y}${pad(Math.floor(doy / 10))}${doy % 10}`);
};

export const pickDailyItem = (list, date = new Date()) => {
  if (!Array.isArray(list) || list.length === 0) return null;
  const seed = dailySeed(date);
  const idx = seed % list.length;
  return list[idx];
};

// Quality-of-life: direct helpers
export const todayPick = (list) => pickDailyItem(list, new Date());
