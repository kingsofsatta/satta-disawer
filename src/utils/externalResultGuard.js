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
  const releaseMinutes = GAME_RELEASE_MINUTES[game];
  return releaseMinutes === undefined || getISTParts(now).minutes >= releaseMinutes;
}

// Gali is announced shortly after midnight even though it belongs to the
// previous day's game cycle. Keep that association until 02:00 IST.
export function isGaliCarryoverWindow(now = new Date()) {
  return getISTParts(now).minutes < GALI_CARRYOVER_END_MINUTES;
}

// a7satta rolls its table to the next game cycle after Gali, before the IST
// calendar date changes. During that window its "yesterday" column no longer
// maps reliably to calendar yesterday.
export function canSyncExternalYesterdayResult(now = new Date()) {
  return getISTParts(now).minutes < GALI_RELEASE_MINUTES;
}

export function isSnapshotFromCurrentISTDate(fetchedAt, now = new Date()) {
  if (!fetchedAt) return false;

  const snapshotDate = new Date(fetchedAt);
  if (Number.isNaN(snapshotDate.getTime())) return false;

  return getISTParts(snapshotDate).date === getISTParts(now).date;
}
