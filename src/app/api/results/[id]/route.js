import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import {
    getWaitingGameByISTTime,
    withCompatibleWaitingGame,
} from "@/utils/resultCompatibility";

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const data = await request.json();

        const result = await Result.findByIdAndUpdate(
            id,
            { ...data, waitingGame: getWaitingGameByISTTime() },
            { new: true },
        );

        if (!result) {
            return NextResponse.json(
                { error: "Result not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(withCompatibleWaitingGame(result));
    } catch (error) {
        console.error("Error updating result:", error);
        return NextResponse.json(
            { error: "Failed to update result" },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = params;
        const result = await Result.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json(
                { error: "Result not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Result deleted successfully" });
    } catch (error) {
        console.error("Error deleting result:", error);
        return NextResponse.json(
            { error: "Failed to delete result" },
            { status: 500 }
        );
    }
}
