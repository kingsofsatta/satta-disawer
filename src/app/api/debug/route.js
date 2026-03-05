import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";

export async function GET(request) {
    try {
        await connectDB();

        // Get total count
        const totalCount = await Result.countDocuments({});

        // Get sample results
        const sampleResults = await Result.find({})
            .limit(10)
            .sort({ date: -1 })
            .lean();

        // Get count by year
        const results2025 = await Result.countDocuments({
            date: { $gte: "2025-01-01", $lte: "2025-12-31" }
        });

        const results2026 = await Result.countDocuments({
            date: { $gte: "2026-01-01", $lte: "2026-12-31" }
        });

        // Get disawer results for 2025
        const disawer2025 = await Result.find({
            game: "disawer",
            date: { $gte: "2025-01-01", $lte: "2025-12-31" }
        }).limit(5).lean();

        return NextResponse.json({
            totalCount,
            results2025,
            results2026,
            sampleResults,
            disawer2025Sample: disawer2025,
            dbConnected: true
        });
    } catch (error) {
        console.error("Debug error:", error);
        return NextResponse.json({
            error: error.message,
            dbConnected: false
        }, { status: 500 });
    }
}
