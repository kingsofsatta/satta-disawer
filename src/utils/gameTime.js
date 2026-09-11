const IST_TIME_ZONE = "Asia/Kolkata";

export const parseGameTimeToMinutes = (timeValue) => {
  const match = String(timeValue || "")
    .trim()
    .toUpperCase()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
  if (hours === 12) hours = 0;
  if (period === "PM") hours += 12;

  return hours * 60 + minutes;
};

export const getISTMinutes = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return Number(values.hour) * 60 + Number(values.minute);
};

export const isWaitingForResult = (timeValue, now = new Date()) => {
  const gameMinutes = parseGameTimeToMinutes(timeValue);
  return gameMinutes !== null && getISTMinutes(now) >= gameMinutes;
};
