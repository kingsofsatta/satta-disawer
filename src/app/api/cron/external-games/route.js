import { NextResponse } from "next/server";
import { fetchExternalGames, cleanupExternalGames } from "@/services/externalGameService";

const MAX_ATTEMPTS = 3;

async function runCronWithRetry() {
    let lastError;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
            const games = await fetchExternalGames();
            await cleanupExternalGames();
            return { games, attempt };
        } catch (error) {
            lastError = error;
            console.error(`External games attempt ${attempt} failed:`, error.message);
            if (attempt < MAX_ATTEMPTS) {
                await new Promise((resolve) => setTimeout(resolve, attempt * 500));
            }
        }
    }

    throw lastError;
}

// This API route is called every minute by cron-job.org.
export async function GET(request) {
    // cron-job.org can send either an Authorization header or ?secret=...
    const authHeader = request.headers.get('authorization');
    const querySecret = new URL(request.url).searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        return NextResponse.json(
            { error: 'CRON_SECRET is not configured' },
            { status: 500 },
        );
    }

    if (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("Starting external games cron job...");
        const { games, attempt } = await runCronWithRetry();
        console.log(`Successfully fetched ${games.length} games from a7satta.com`);
        
        return NextResponse.json({ 
            success: true, 
            gamesCount: games.length,
            resultsCollectionUpdated: true,
            games,
            attempt,
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Allow calling without auth for testing in development
export async function POST(request) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    try {
        const { games, attempt } = await runCronWithRetry();
        return NextResponse.json({ 
            success: true, 
            gamesCount: games.length,
            games,
            attempt,
        });
    } catch (error) {
        return NextResponse.json({ 
            error: "Failed to fetch external games",
            message: error.message 
        }, { status: 500 });
    }
}
