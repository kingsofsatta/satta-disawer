// Server-side results service - uses direct database access
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import { GAMES } from "@/utils/gameConfig";

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
        console.log('DB: Fetching results for:', today);

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
        const result = await Result.find({ date: today })
            .sort({ updatedAt: -1 })
            .limit(1)
            .lean();

        if (!result || result.length === 0) return null;
        return JSON.parse(JSON.stringify(result[0]));
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
            game: 'disawer'
        }).lean();

        // Get yesterday's DISAWAR result
        const yesterdayResult = await Result.findOne({
            date: yesterday,
            game: 'disawer'
        }).lean();

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
            game: gameKey,
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
