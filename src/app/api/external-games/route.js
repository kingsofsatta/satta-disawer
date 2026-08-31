import { NextResponse } from "next/server";
import { getExternalGames, fetchExternalGames, cleanupExternalGames } from "@/services/externalGameService";

export async function GET(request) {
    try {
        await cleanupExternalGames();
        let games = await getExternalGames();
        const newestFetch = Math.max(
            0,
            ...games.map((game) => new Date(game.fetchedAt).getTime() || 0),
        );

        // Browser polling hits this endpoint. Only scrape when the shared DB
        // snapshot is stale, so every visitor does not call the source site.
        if (games.length < 6 || Date.now() - newestFetch >= 60 * 1000) {
            games = await fetchExternalGames();
        }

        return NextResponse.json(games, {
            headers: { "Cache-Control": "no-store, max-age=0" },
        });
    } catch (error) {
        console.error("Error fetching stored external games:", error);
        return NextResponse.json({ error: "Failed to fetch external games" }, { status: 500 });
    }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
    try {
        const fetchedGames = await fetchExternalGames();
        await cleanupExternalGames();
        return NextResponse.json({ fetchedGames });
    } catch (error) {
        console.error("Error scraping external games:", error);
        return NextResponse.json({ error: "Failed to fetch external games" }, { status: 500 });
    }
}
