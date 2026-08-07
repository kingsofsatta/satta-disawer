// This utility triggers external games fetch on server-side page loads
// This provides more frequent updates than once-daily cron jobs

import { fetchExternalGames, cleanupExternalGames } from "@/services/externalGameService";

let lastFetchTime = 0;
const FETCH_COOLDOWN = 1000 * 60 * 15; // 15 minutes cooldown

export async function triggerExternalGamesFetch() {
    const now = Date.now();
    
    // Only fetch if cooldown period has passed
    if (now - lastFetchTime < FETCH_COOLDOWN) {
        return { skipped: true, reason: "cooldown", nextFetchIn: FETCH_COOLDOWN - (now - lastFetchTime) };
    }

    try {
        lastFetchTime = now;
        await cleanupExternalGames();
        const games = await fetchExternalGames();
        return { success: true, gamesCount: games.length };
    } catch (error) {
        console.error("Error fetching external games:", error);
        return { success: false, error: error.message };
    }
}
