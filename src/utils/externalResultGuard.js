const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const GALI_RELEASE_MINUTES = 23 * 60 + 30;
const GALI_CARRYOVER_END_MINUTES = 2 * 60;

const GAME_RELEASE_MINUTES = {
  disawer: 5 * 60 + 20,
  "delhi-bazar": 15 * 60,
  "shri-ganesh": 16 * 60 + 40,
  faridabad: 18 * 60,
  gaziyabad: 21 * 60 + 30,
  gali: GALI_RELEASE_MINUTES,
};

function getISTParts(date = new Date()) {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);

  return {
    date: ist.toISOString().slice(0, 10),
    minutes: ist.getUTCHours() * 60 + ist.getUTCMinutes(),
  };
}

export function canUseExternalTodayResult(game, now = new Date()) {
  const { date, minutes } = getISTParts(now);
  const [year, month, day] = date.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  // On the final day of a month only Disawer publishes a new result. Never
  // treat numbers retained by the source for other games as today's results.
  if (day === daysInMonth && game !== "disawer") return false;

  const releaseMinutes = GAME_RELEASE_MINUTES[game];
  return releaseMinutes === undefined || minutes >= releaseMinutes;
}

// Gali is announced shortly after midnight even though it belongs to the
// previous day's game cycle. Keep that association until 02:00 IST.
export function isGaliCarryoverWindow(now = new Date()) {
  return getISTParts(now).minutes < GALI_CARRYOVER_END_MINUTES;
}

export function isSnapshotFromCurrentISTDate(fetchedAt, now = new Date()) {
  if (!fetchedAt) return false;

  const snapshotDate = new Date(fetchedAt);
  if (Number.isNaN(snapshotDate.getTime())) return false;

  return getISTParts(snapshotDate).date === getISTParts(now).date;
}
