import { NextResponse } from "next/server";
import { getExternalGames, fetchExternalGames, cleanupExternalGames } from "@/services/externalGameService";

export async function GET(request) {
    try {
        await cleanupExternalGames();
        const games = await getExternalGames();
        return NextResponse.json(games);
    } catch (error) {
        console.error("Error fetching stored external games:", error);
        return NextResponse.json({ error: "Failed to fetch external games" }, { status: 500 });
    }
}

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
