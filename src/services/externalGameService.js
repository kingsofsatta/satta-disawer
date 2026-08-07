import { connectDB } from "@/lib/db";
import ExternalGame from "@/models/ExternalGame";
import { defaultGameSchedule } from "@/utils/defaultGameSchedule";
import * as cheerio from "cheerio";

const SOURCE_URL = "https://satta-king-fast.com/";

const normalizeGameName = (name) => name.trim().replace(/\s+/g, " ").toUpperCase();

const normalizeGameTime = (time) => time.trim().toUpperCase();

const isDefaultGame = (game) => {
    return defaultGameSchedule.some((defaultGame) =>
        defaultGame.name.toUpperCase() === game.name.toUpperCase() &&
        defaultGame.time.toUpperCase() === game.time.toUpperCase()
    );
};

export async function fetchExternalGames() {
    await connectDB();

    const response = await fetch(SOURCE_URL, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch external games: ${response.status}`);
    }

    const html = await response.text();

    if (/Attention Required|Just a moment|Cloudflare/i.test(html)) {
        throw new Error("External site returned a Cloudflare challenge page");
    }

    const $ = cheerio.load(html);
    const parsedGames = [];

    $("tr.game-result").each((_, row) => {
        const name = $(row).find(".game-name").text().trim();
        const timeRaw = $(row).find(".game-time").text().replace(/^at/i, "").trim();
        const yesterdayResult = $(row).find(".yesterday-number h3").text().trim();
        const todayResult = $(row).find(".today-number h3").text().trim();
        if (!name || !timeRaw) {
            return;
        }

        parsedGames.push({
            name: normalizeGameName(name),
            time: normalizeGameTime(timeRaw),
            yesterdayResult: yesterdayResult || "--",
            todayResult: todayResult || "--",
        });
    });

    const uniqueGames = [];
    const seen = new Set();
    for (const game of parsedGames) {
        const key = `${game.name}||${game.time}`;
        if (!seen.has(key) && !isDefaultGame(game)) {
            seen.add(key);
            uniqueGames.push(game);
        }
    }

    await Promise.all(
        uniqueGames.map(async (game) => {
            try {
                await ExternalGame.updateOne(
                    { name: game.name, time: game.time },
                    {
                        $set: {
                            todayResult: game.todayResult,
                            yesterdayResult: game.yesterdayResult,
                            fetchedAt: new Date(),
                        },
                        $setOnInsert: { source: "satta-king-fast" },
                    },
                    { upsert: true }
                );
            } catch (error) {
                console.error("Failed to upsert external game:", game, error);
            }
        })
    );

    return uniqueGames;
}

export async function getExternalGames() {
    await connectDB();
    const games = await ExternalGame.find({}).sort({ fetchedAt: -1 }).lean();
    return games.map((game) => ({
        name: game.name,
        time: game.time,
        todayResult: game.todayResult,
        yesterdayResult: game.yesterdayResult,
    }));
}

export async function cleanupExternalGames() {
    await connectDB();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    await ExternalGame.deleteMany({ fetchedAt: { $lt: twoDaysAgo } });
}
