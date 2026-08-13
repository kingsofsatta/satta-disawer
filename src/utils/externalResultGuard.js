const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DISAWER_RELEASE_MINUTES = 5 * 60 + 20;

function getISTParts(date = new Date()) {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);

  return {
    date: ist.toISOString().slice(0, 10),
    minutes: ist.getUTCHours() * 60 + ist.getUTCMinutes(),
  };
}

export function canUseDisawerTodayResult(now = new Date()) {
  return getISTParts(now).minutes >= DISAWER_RELEASE_MINUTES;
}

export function isSnapshotFromCurrentISTDate(fetchedAt, now = new Date()) {
  if (!fetchedAt) return false;

  const snapshotDate = new Date(fetchedAt);
  if (Number.isNaN(snapshotDate.getTime())) return false;

  return getISTParts(snapshotDate).date === getISTParts(now).date;
}
