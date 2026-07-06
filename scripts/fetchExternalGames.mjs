import { fetchExternalGames, cleanupExternalGames } from "../src/services/externalGameService.js";

async function main() {
    try {
        const games = await fetchExternalGames();
        console.log(`Fetched ${games.length} external games.`);
        await cleanupExternalGames();
        console.log("Cleaned up old external games.");
    } catch (error) {
        console.error("Failed to fetch external games:", error);
        process.exitCode = 1;
    }
}

main();
