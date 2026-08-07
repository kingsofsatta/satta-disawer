import { NextResponse } from "next/server";
import { fetchExternalGames, cleanupExternalGames } from "@/services/externalGameService";

// This API route is called by Vercel Cron Jobs
export async function GET(request) {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("Starting external games cron job...");
        await cleanupExternalGames();
        const games = await fetchExternalGames();
        console.log(`Successfully fetched ${games.length} games from a7satta.com`);
        
        return NextResponse.json({ 
            success: true, 
            gamesCount: games.length,
            timestamp: new Date().toISOString(),
            source: "a7satta.com"
        });
    } catch (error) {
        console.error("External games cron error:", error);
        return NextResponse.json({ 
            error: "Failed to fetch external games",
            message: error.message 
        }, { status: 500 });
    }
}

// Allow calling without auth for testing in development
export async function POST(request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    try {
        await cleanupExternalGames();
        const games = await fetchExternalGames();
        return NextResponse.json({ 
            success: true, 
            gamesCount: games.length,
            games: games
        });
    } catch (error) {
        return NextResponse.json({ 
            error: "Failed to fetch external games",
            message: error.message 
        }, { status: 500 });
    }
}
