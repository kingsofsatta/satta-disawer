import { connectDB } from "@/lib/db";
import ExternalGame from "@/models/ExternalGame";
import { defaultGameSchedule } from "@/utils/defaultGameSchedule";
import * as cheerio from "cheerio";

const SOURCE_URL = "https://a7satta.com/";

// Specific games to fetch from a7satta.com
const TARGET_GAMES = [
    { name: "DELHI BAZAR", pattern: /delhi\s*baz[ao]r/i },
    { name: "SHRI GANESH", pattern: /shri?\s*ganesh/i },
    { name: "FARIDABAD", pattern: /faridabad/i },
    { name: "GHAZIABAD", pattern: /gaz?iabad/i },
    { name: "GALI", pattern: /^gali$/i },
    { name: "DISAWER", pattern: /dis?awer/i }
];

const normalizeGameName = (name) => name.trim().replace(/\s+/g, " ").toUpperCase();

const normalizeGameTime = (time) => time.trim().toUpperCase();

const isDefaultGame = (game) => {
    return defaultGameSchedule.some((defaultGame) =>
        defaultGame.name.toUpperCase() === game.name.toUpperCase() &&
        defaultGame.time.toUpperCase() === game.time.toUpperCase()
    );
};

const isTargetGame = (gameName) => {
    const normalized = normalizeGameName(gameName);
    return TARGET_GAMES.some(target => target.pattern.test(normalized));
};

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

    const $ = cheerio.load(html);
    const parsedGames = [];

    // Parse the main results table
    $("table tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length < 2) return;

        const firstCell = $(cells[0]).text().trim();
        
        // Extract game name and time from first cell (e.g., "DELHI BAZAR 3:15 PM")
        const match = firstCell.match(/^(.+?)\s+(\d{1,2}:\d{2}\s*(?:AM|PM))$/i);
        
        if (match) {
            const gameName = match[1].trim();
            const gameTime = match[2].trim();
            
            // Only process games in our target list
            if (!isTargetGame(gameName)) return;
            
            const yesterdayResult = $(cells[1]).text().trim();
            const todayResult = cells.length > 2 ? $(cells[2]).text().trim() : "--";

            // Skip if today's result contains "wait" or is empty
            if (!todayResult || todayResult === "--" || /wait/i.test(todayResult)) {
                parsedGames.push({
                    name: normalizeGameName(gameName),
                    time: normalizeGameTime(gameTime),
                    yesterdayResult: yesterdayResult || "--",
                    todayResult: "--",
                });
            } else {
                parsedGames.push({
                    name: normalizeGameName(gameName),
                    time: normalizeGameTime(gameTime),
                    yesterdayResult: yesterdayResult || "--",
                    todayResult: todayResult,
                });
            }
        }
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
                        $setOnInsert: { source: "a7satta" },
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
