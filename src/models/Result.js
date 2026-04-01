import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        game: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        date: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/,
        },
        resultNumber: {
            type: String,
            required: true,
        },
        waitingGame: {
            type: String,
            default: "",
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create compound index for faster queries
resultSchema.index({ game: 1, date: 1 });
resultSchema.index({ date: 1 });

export default mongoose.models.Result || mongoose.model("Result", resultSchema);
