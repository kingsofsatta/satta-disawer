import { fetchExternalGames, cleanupExternalGames } from "@/services/externalGameService";

let initialized = false;
const REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 4; // every 4 hours

export function initializeExternalGamesCron() {
    if (initialized || typeof window !== "undefined") return;
    initialized = true;

    const refresh = async () => {
        try {
            await cleanupExternalGames();
            await fetchExternalGames();
        } catch (error) {
            console.error("External games cron error:", error);
        }
    };

    refresh();
    setInterval(refresh, REFRESH_INTERVAL_MS);
}
