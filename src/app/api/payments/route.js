import { connectDB } from "@/lib/db";
import PaymentProof from "@/models/PaymentProof";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get("active") === "true";

        let query = {};
        if (activeOnly) {
            query.isActive = true;
        }

        const proofs = await PaymentProof.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return Response.json(proofs);
    } catch (error) {
        console.error("GET Payment Proofs Error:", error);
        return Response.json(
            { error: "Failed to fetch payment proofs" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const formData = await req.formData();
        const file = formData.get("file");
        const title = formData.get("title") || "";
        const description = formData.get("description") || "";
        const uploadedBy = formData.get("uploadedBy") || "admin";

        if (!file) {
            return Response.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return Response.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
            return Response.json(
                { error: "Only image files are allowed" },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const imageUrl = `data:${file.type};base64,${base64}`;

        // Create new payment proof
        const newProof = new PaymentProof({
            imageUrl,
            imageBase64: base64,
            title,
            description,
            uploadedBy,
            isActive: true,
        });

        await newProof.save();

        return Response.json(newProof, { status: 201 });
    } catch (error) {
        console.error("POST Payment Proof Error:", error);
        return Response.json(
            { error: "Failed to upload payment proof" },
            { status: 500 }
        );
    }
}
