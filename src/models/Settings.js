import mongoose from "mongoose";

// Schema for individual game schedule item
const gameScheduleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: String, required: true }
}, { _id: false });

// Schema for khaiwal section
const khaiwalSectionSchema = new mongoose.Schema({
    enabled: { type: Boolean, default: true },
    contactName: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    paymentNumber: { type: String, default: "" },
    rate: { type: String, default: "" },
    gameSchedule: { type: [gameScheduleSchema], default: [] }
}, { _id: false });

const settingsSchema = new mongoose.Schema(
    {
        // Legacy fields for backward compatibility
        site2_name: String,
        site2_contactName: String,
        site2_whatsappNumber: String,
        site2_paymentNumber: String,
        site2_rate: String,
        contactName: String,
        whatsappNumber: String,
        siteName: {
            type: String,
            default: "Satta Disawer Satta",
        },

        // Site 1 individual fields (backward compatibility)
        site1_contactName: String,
        site1_whatsappNumber: String,
        site1_paymentNumber: String,
        site1_rate: String,

        // New khaiwal sections configuration
        khaiwalSection1: {
            type: khaiwalSectionSchema,
            default: () => ({
                enabled: true,
                contactName: "",
                whatsappNumber: "",
                paymentNumber: "",
                rate: "",
                gameSchedule: [
                    { name: "SHIRDI DHAM", time: "12:55 PM" },
                    { name: "KALIYAR", time: "01:55 PM" },
                    { name: "DELHI BAZAR", time: "03:00 PM" },
                    { name: "SHRI GANESH", time: "04:30 PM" },
                    { name: "FARIDABAD", time: "05:45 PM" },
                    { name: "SHAKTI PEETH", time: "07:25 PM" },
                    { name: "GAZIYABAD", time: "09:00 PM" },
                    { name: "MATHURA", time: "10:00 PM" },
                    { name: "GALI", time: "11:30 PM" },
                    { name: "DISAWAR", time: "04:50 AM" }
                ]
            })
        },
        khaiwalSection2: {
            type: khaiwalSectionSchema,
            default: () => ({
                enabled: false,
                contactName: "",
                whatsappNumber: "",
                paymentNumber: "",
                rate: "",
                gameSchedule: [
                    { name: "SHIRDI DHAM", time: "12:55 PM" },
                    { name: "KALIYAR", time: "01:55 PM" },
                    { name: "DELHI BAZAR", time: "03:00 PM" },
                    { name: "SHRI GANESH", time: "04:30 PM" },
                    { name: "FARIDABAD", time: "05:45 PM" },
                    { name: "SHAKTI PEETH", time: "07:25 PM" },
                    { name: "GAZIYABAD", time: "09:00 PM" },
                    { name: "MATHURA", time: "10:00 PM" },
                    { name: "GALI", time: "11:30 PM" },
                    { name: "DISAWAR", time: "04:50 AM" }
                ]
            })
        }
    },
    {
        timestamps: true,
    }
);

// Clear cached model in development to pick up schema changes
const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
