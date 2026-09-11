import { connectExtraGamesDB } from "@/lib/extraGamesDb";

const ARCHIVE_GAME_FIELDS = {
  DS: "dswr",
  DB: "dlbz",
  SG: "srgn",
  FB: "frbd",
  GB: "gzbd",
  GL: "gali",
};

const getISTDate = (daysOffset = 0) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(Date.now() + daysOffset * 86_400_000));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const formatResultTime = (value) => {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  if (!match) return "--";
  const hour = Number(match[1]);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${String(displayHour).padStart(2, "0")}:${match[2]} ${period}`;
};

export async function getExtraGames() {
  const connection = await connectExtraGamesDB();
  const gamesCollection = connection.db.collection("games");
  const resultsCollection = connection.db.collection("gameresults");
  const today = getISTDate();
  const yesterday = getISTDate(-1);

  const games = await gamesCollection
    .find({ isActive: true })
    .sort({ showIndex: 1, resultTime: 1, name: 1 })
    .toArray();

  const gameIds = games.map((game) => game._id);
  const results = await resultsCollection
    .find({ game: { $in: gameIds }, resultDate: { $in: [today, yesterday] } })
    .sort({ updatedAt: -1 })
    .toArray();

  const resultMap = new Map();
  for (const result of results) {
    const key = `${result.game}|${result.resultDate}`;
    if (!resultMap.has(key)) resultMap.set(key, String(result.result || "--"));
  }

  return games.map((game) => ({
    id: String(game._id),
    name: String(game.name || "").trim(),
    time: formatResultTime(game.resultTime),
    yesterday: resultMap.get(`${game._id}|${yesterday}`) || "--",
    today: resultMap.get(`${game._id}|${today}`) || "--",
  }));
}

export async function getExtraGamesMonthlyArchive(year, month) {
  const connection = await connectExtraGamesDB();
  const gamesCollection = connection.db.collection("games");
  const resultsCollection = connection.db.collection("gameresults");
  const monthValue = String(month).padStart(2, "0");
  const startDate = `${year}-${monthValue}-01`;
  const endDate = `${year}-${monthValue}-31`;

  const games = await gamesCollection
    .find({ code: { $in: Object.keys(ARCHIVE_GAME_FIELDS) } })
    .toArray();
  const gameFields = new Map(
    games.map((game) => [String(game._id), ARCHIVE_GAME_FIELDS[game.code]]),
  );
  const results = await resultsCollection
    .find({
      game: { $in: games.map((game) => game._id) },
      resultDate: { $gte: startDate, $lte: endDate },
    })
    .sort({ updatedAt: 1 })
    .toArray();

  const rows = new Map();
  for (const result of results) {
    const day = Number(String(result.resultDate).slice(-2));
    const field = gameFields.get(String(result.game));
    if (!field || !Number.isFinite(day)) continue;
    if (!rows.has(day)) rows.set(day, { day, results: {} });
    rows.get(day).results[field] = String(result.result || "--");
  }

  return { chart: { rows: [...rows.values()].sort((a, b) => a.day - b.day) } };
}
