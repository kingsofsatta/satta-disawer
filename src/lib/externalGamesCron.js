import { fetchExternalGames, cleanupExternalGames } from "@/services/externalGameService";

let initialized = false;
const REFRESH_INTERVAL_MS = 1000 * 60 * 30; // every 30 minutes for frequent updates

export function initializeExternalGamesCron() {
    if (initialized || typeof window !== "undefined") return;
    initialized = true;

    const refresh = async () => {
        try {
            await cleanupExternalGames();
            await fetchExternalGames();
            console.log("External games updated from a7satta.com");
        } catch (error) {
            console.error("External games cron error:", error);
        }
    };

    // Run immediately on initialization
    refresh();
    // Then run every 30 minutes
    setInterval(refresh, REFRESH_INTERVAL_MS);
}
