import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Result from "@/models/Result";
import { normalizeGameKey } from "@/utils/gameConfig";
import {
    getWaitingGameByISTTime,
    withCompatibleWaitingGame,
} from "@/utils/resultCompatibility";

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const data = await request.json();

        const errors = validateResultData(data);
        if (errors.length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const normalizedData = {
            game: normalizeGameKey(data.game),
            date: data.date,
            resultNumber: String(data.resultNumber).trim(),
            waitingGame: getWaitingGameByISTTime(),
        };

        const result = await Result.findByIdAndUpdate(
            id,
            normalizedData,
            { new: true, runValidators: true },
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

        const { id } = await params;
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

function validateResultData(data) {
    const errors = [];

    if (!data.game) errors.push("Game is required");
    if (!data.date) errors.push("Date is required");
    if (!data.resultNumber) errors.push("Result number is required");

    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        errors.push("Date must be in YYYY-MM-DD format");
    }

    if (data.resultNumber && !/^\d+$/.test(String(data.resultNumber))) {
        errors.push("Result number should contain only numbers");
    }

    return errors;
}
