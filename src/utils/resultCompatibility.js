import { GAMES } from "@/utils/gameConfig";

function timeToMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return Number.POSITIVE_INFINITY;

  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + minutes;
}

// Return the next game from the centralized table schedule using IST. After
// GALI, the next game is the following morning's DISAWER.
export function getWaitingGameByISTTime(now = new Date()) {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const currentMinutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  const nextGame = GAMES.find(
    (game) => timeToMinutes(game.time) > currentMinutes,
  );

  return nextGame?.key || GAMES[0]?.key || "";
}

export function withCompatibleWaitingGame(result) {
  if (!result) return result;

  const plainResult = typeof result.toObject === "function"
    ? result.toObject()
    : result;

  return {
    ...plainResult,
    // Always calculate this at response time. A stored value can become stale,
    // especially for results inserted or updated by the scraper cron.
    waitingGame: getWaitingGameByISTTime(),
  };
}
