import mongoose from "mongoose";

const paymentProofSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        imageBase64: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: "",
        },
        description: {
            type: String,
            required: false,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        uploadedBy: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for faster queries
paymentProofSchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.models.PaymentProof || mongoose.model("PaymentProof", paymentProofSchema);
