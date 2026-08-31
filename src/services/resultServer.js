// Server-side results service - uses direct database access
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import { GAMES, getCompatibleGameKeys } from "@/utils/gameConfig";
import { withCompatibleWaitingGame } from "@/utils/resultCompatibility";

function getISTDate(daysOffset = 0) {
    const date = new Date();
    // Add IST offset (5.5 hours)
    date.setTime(date.getTime() + (5.5 * 60 * 60 * 1000));
    // Add/subtract days if needed
    if (daysOffset !== 0) {
        date.setDate(date.getDate() + daysOffset);
    }
    // Format as YYYY-MM-DD
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function getTodayResultFromDB() {
    try {
        await connectDB();
        const today = getISTDate();

        const results = await Result.find({ date: today })
            .sort({ updatedAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error("Error fetching today's results from DB:", error);
        return [];
    }
}

export async function getYesterdayResultsFromDB() {
    try {
        await connectDB();
        const yesterday = getISTDate(-1);
        console.log('DB: Fetching yesterday results for:', yesterday);

        const results = await Result.find({ date: yesterday })
            .sort({ updatedAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error("Error fetching yesterday's results from DB:", error);
        return [];
    }
}

export async function getLastResultFromDB() {
    try {
        await connectDB();
        const today = getISTDate();
        const yesterday = getISTDate(-1);
        const now = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
        const currentMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
        const scheduledGames = GAMES.map((game) => {
            const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(game.time);
            if (!match) return null;

            let hours = Number(match[1]) % 12;
            if (match[3].toUpperCase() === 'PM') hours += 12;

            return {
                game: game.key,
                minutes: hours * 60 + Number(match[2]),
            };
        }).filter(Boolean);

        const results = await Result.find({
            date: { $in: [today, yesterday] },
            game: { $in: scheduledGames.map(({ game }) => game) },
        }).lean();
        const resultByDateAndGame = new Map(
            results.map((result) => [`${result.date}||${result.game}`, result]),
        );

        // Ignore results for games whose scheduled time has not arrived yet.
        // If a scheduled result is missing, fall back to the previous completed
        // game, then to the latest game from yesterday.
        const todayGames = scheduledGames
            .filter(({ minutes }) => minutes <= currentMinutes)
            .sort((a, b) => b.minutes - a.minutes);
        const yesterdayGames = [...scheduledGames]
            .sort((a, b) => b.minutes - a.minutes);
        const candidates = [
            ...todayGames.map(({ game }) => `${today}||${game}`),
            ...yesterdayGames.map(({ game }) => `${yesterday}||${game}`),
        ];
        const result = candidates
            .map((key) => resultByDateAndGame.get(key))
            .find(Boolean);

        return result
            ? JSON.parse(JSON.stringify(withCompatibleWaitingGame(result)))
            : null;
    } catch (error) {
        console.error("Error fetching last result from DB:", error);
        return null;
    }
}

export async function getMonthlyResultsFromDB(month, year) {
    try {
        await connectDB();
        const monthStr = String(month).padStart(2, '0');
        const startDate = `${year}-${monthStr}-01`;
        const endDate = `${year}-${monthStr}-31`;

        const results = await Result.find({
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 }).lean();

        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error("Error fetching monthly results from DB:", error);
        return [];
    }
}

export async function getDisawarDataFromDB() {
    try {
        await connectDB();
        const today = getISTDate();
        const yesterday = getISTDate(-1);

        // Get today's DISAWAR result (use lowercase 'disawer' as stored in DB)
        const todayResult = await Result.findOne({
            date: today,
            game: { $in: getCompatibleGameKeys('disawer') }
        }).sort({ updatedAt: -1 }).lean();

        // Get yesterday's DISAWAR result
        const yesterdayResult = await Result.findOne({
            date: yesterday,
            game: { $in: getCompatibleGameKeys('disawer') }
        }).sort({ updatedAt: -1 }).lean();

        return {
            today: todayResult?.resultNumber || null,
            yesterday: yesterdayResult?.resultNumber || null
        };
    } catch (error) {
        console.error("Error fetching DISAWAR data from DB:", error);
        return { today: null, yesterday: null };
    }
}

export async function getYearlyResultsFromDB(gameKey, year) {
    try {
        await connectDB();
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        console.log(`DB: Fetching yearly results for ${gameKey} in ${year}`);

        const results = await Result.find({
            game: { $in: getCompatibleGameKeys(gameKey) },
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 }).lean();

        console.log(`DB: Found ${results.length} results for ${gameKey} in ${year}`);

        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error("Error fetching yearly results from DB:", error);
        return [];
    }
}

// ==================== CHART HELPERS ====================
const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

export const gameSlugMapping = {};
GAMES.forEach(game => {
    years.forEach(year => {
        gameSlugMapping[`${game.key.replace('_', '-')}-yearly-chart-${year}`] = game.key;
    });
});

export function parseSlugData(slug) {
    const gameDisplayNames = {};

    GAMES.forEach(game => {
        years.forEach(year => {
            gameDisplayNames[`${game.key.replace('_', '-')}-yearly-chart-${year}`] = {
                name: game.name,
                year: String(year)
            };
        });
    });

    return gameDisplayNames[slug] || null;
}

export function transformYearlyData(results) {
    const months = {
        JAN: {}, FEB: {}, MAR: {}, APR: {}, MAY: {}, JUN: {},
        JUL: {}, AUG: {}, SEP: {}, OCT: {}, NOV: {}, DEC: {}
    };

    const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    results.forEach(result => {
        const date = new Date(result.date);
        const month = monthNames[date.getMonth()];
        const day = date.getDate();

        if (months[month]) {
            months[month][day] = result.resultNumber;
        }
    });

    return months;
}
