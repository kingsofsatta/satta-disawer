import { connectDB } from "@/lib/db";
import PaymentProof from "@/models/PaymentProof";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const proof = await PaymentProof.findById(id);
        if (!proof) {
            return Response.json(
                { error: "Payment proof not found" },
                { status: 404 }
            );
        }

        return Response.json(proof);
    } catch (error) {
        console.error("GET Payment Proof Error:", error);
        return Response.json(
            { error: "Failed to fetch payment proof" },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const { title, description, isActive } = await req.json();

        const updatedProof = await PaymentProof.findByIdAndUpdate(
            id,
            { title, description, isActive },
            { new: true }
        );

        if (!updatedProof) {
            return Response.json(
                { error: "Payment proof not found" },
                { status: 404 }
            );
        }

        return Response.json(updatedProof);
    } catch (error) {
        console.error("PUT Payment Proof Error:", error);
        return Response.json(
            { error: "Failed to update payment proof" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const deletedProof = await PaymentProof.findByIdAndDelete(id);
        if (!deletedProof) {
            return Response.json(
                { error: "Payment proof not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { message: "Payment proof deleted successfully" }
        );
    } catch (error) {
        console.error("DELETE Payment Proof Error:", error);
        return Response.json(
            { error: "Failed to delete payment proof" },
            { status: 500 }
        );
    }
}
