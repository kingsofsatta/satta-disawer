import { connectDB } from "@/lib/db";
import ExternalGame from "@/models/ExternalGame";
import { parseA7SattaGames } from "@/services/a7SattaParser";

const SOURCE_URL = "https://a7satta.com/";
const TARGET_GAME_NAMES = [
    "DELHI BAZAR",
    "SHRI GANESH",
    "FARIDABAD",
    "GHAZIABAD",
    "GALI",
    "DISAWER",
];

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

    return uniqueGames;
}

export async function getExternalGames() {
    await connectDB();
    const games = await ExternalGame.find({
        source: "a7satta",
        name: { $in: TARGET_GAME_NAMES },
    }).sort({ fetchedAt: -1 }).lean();

    const uniqueGames = [...new Map(games.map((game) => [game.name, game])).values()];
    return uniqueGames.map((game) => ({
        name: game.name,
        time: game.time,
        todayResult: game.todayResult,
        yesterdayResult: game.yesterdayResult,
        fetchedAt: game.fetchedAt,
    }));
}

export async function cleanupExternalGames() {
    await connectDB();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    await ExternalGame.deleteMany({ fetchedAt: { $lt: twoDaysAgo } });
}
