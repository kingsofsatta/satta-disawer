import mongoose from "mongoose";

const externalGameSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        time: { type: String, required: true },
        todayResult: { type: String, default: null },
        yesterdayResult: { type: String, default: null },
        source: { type: String, default: "satta-king-fast" },
        fetchedAt: { type: Date, default: Date.now, expires: "2d" },
    },
    {
        timestamps: true,
    }
);

externalGameSchema.index({ name: 1, time: 1 }, { unique: true });

const ExternalGame = mongoose.models.ExternalGame || mongoose.model("ExternalGame", externalGameSchema);

export default ExternalGame;
