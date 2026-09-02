import { connectDB } from "@/lib/db";
import ExternalGame from "@/models/ExternalGame";
import Result from "@/models/Result";
import { parseA7SattaGames } from "@/services/a7SattaParser";
import { getWaitingGameByISTTime } from "@/utils/resultCompatibility";
import {
    canUseExternalTodayResult,
    isGaliCarryoverWindow,
    isSnapshotFromCurrentISTDate,
} from "@/utils/externalResultGuard";

const SOURCE_URL = "https://a7satta.com/";
const TARGET_GAME_NAMES = [
    "DELHI BAZAR",
    "SHRI GANESH",
    "FARIDABAD",
    "GHAZIABAD",
    "GALI",
    "DISAWER",
];

const RESULT_GAME_BY_EXTERNAL_NAME = {
    "DELHI BAZAR": "delhi-bazar",
    "SHRI GANESH": "shri-ganesh",
    FARIDABAD: "faridabad",
    GHAZIABAD: "gaziyabad",
    GALI: "gali",
    DISAWER: "disawer",
};

function getISTDate(daysOffset = 0) {
    const date = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    date.setUTCDate(date.getUTCDate() + daysOffset);
    return date.toISOString().slice(0, 10);
}

async function saveGamesToResults(games) {
    const today = getISTDate();
    const yesterday = getISTDate(-1);
    const waitingGame = getWaitingGameByISTTime();
    const candidates = [];
    const galiCarryover = isGaliCarryoverWindow();

    for (const game of games) {
        const resultGame = RESULT_GAME_BY_EXTERNAL_NAME[game.name];
        if (!resultGame) continue;

        const canSaveTodayResult = canUseExternalTodayResult(resultGame);

        if (resultGame === "gali" && galiCarryover) {
            // During 00:00-01:59 IST, a newly published Gali number belongs to
            // the previous calendar date. Do not fall back to the source's
            // yesterday cell because it may contain an older carried result.
            const carryoverResult = game.todayResult;

            if (/^\d+$/.test(carryoverResult)) {
                candidates.push({
                    game: resultGame,
                    date: yesterday,
                    resultNumber: carryoverResult,
                });
            }
            continue;
        }

        if (canSaveTodayResult && /^\d+$/.test(game.todayResult)) {
            candidates.push({
                game: resultGame,
                date: today,
                resultNumber: game.todayResult,
            });
        }
    }

    if (candidates.length === 0) return;

    const existingResults = await Result.find({
        $or: candidates.map(({ game, date }) => ({ game, date })),
    }).select({ game: 1, date: 1, resultNumber: 1 }).lean();
    const existingByGameAndDate = new Map(
        existingResults.map((result) => [
            `${result.game}||${result.date}`,
            result.resultNumber,
        ]),
    );
    const changedCandidates = candidates.filter(
        ({ game, date, resultNumber }) => {
            const existing = existingByGameAndDate.get(`${game}||${date}`);
            return existing !== resultNumber;
        },
    );
    const operations = changedCandidates.map(
        ({ game, date, resultNumber }) => ({
            updateOne: {
                filter: { game, date },
                update: { $set: { resultNumber, waitingGame } },
                upsert: true,
            },
        }),
    );

    if (operations.length === 0) return;
    await Result.bulkWrite(operations, { ordered: false });
}

export async function fetchExternalGames() {
    await connectDB();

    const response = await fetch(SOURCE_URL, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch external games: ${response.status}`);
    }

    const html = await response.text();

    if (/Attention Required|Just a moment|Cloudflare/i.test(html)) {
        throw new Error("External site returned a Cloudflare challenge page");
    }

    const uniqueGames = parseA7SattaGames(html);

    if (uniqueGames.length !== 6) {
        throw new Error(`Expected 6 target games, parsed ${uniqueGames.length}`);
    }

    const fetchedAt = new Date();
    await ExternalGame.bulkWrite(
        uniqueGames.map((game) => ({
            updateOne: {
                filter: { name: game.name },
                update: {
                    $set: {
                        time: game.time,
                        todayResult: game.todayResult,
                        yesterdayResult: game.yesterdayResult,
                        source: "a7satta",
                        fetchedAt,
                    },
                },
                upsert: true,
            },
        })),
        { ordered: false },
    );

    // Keep the primary results collection in sync with the scraped snapshot.
    // Placeholder values are deliberately excluded so they cannot erase a result.
    await saveGamesToResults(uniqueGames);

    return uniqueGames;
}

export async function getExternalGames() {
    await connectDB();
    const games = await ExternalGame.find({
        source: "a7satta",
        name: { $in: TARGET_GAME_NAMES },
    }).sort({ fetchedAt: -1 }).lean();

    const uniqueGames = [...new Map(games.map((game) => [game.name, game])).values()];
    const snapshot = uniqueGames.map((game) => ({
        name: game.name,
        time: game.time,
        todayResult: game.todayResult,
        yesterdayResult: game.yesterdayResult,
        fetchedAt: game.fetchedAt,
    }));

    // A current-day cache can contain a newly scraped result even when an
    // earlier guarded write did not reach the primary Result collection.
    // Reconcile only current-IST-day snapshots and only their today values.
    if (snapshot.some((game) => isSnapshotFromCurrentISTDate(game.fetchedAt))) {
        await saveGamesToResults(
            snapshot.filter((game) => isSnapshotFromCurrentISTDate(game.fetchedAt)),
        );
    }

    return snapshot;
}

export async function cleanupExternalGames() {
    await connectDB();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    await ExternalGame.deleteMany({ fetchedAt: { $lt: twoDaysAgo } });
}
