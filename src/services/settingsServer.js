// Server-side settings service - uses direct database access
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

// Default game schedule
const defaultGameSchedule = [
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
];

export async function getSettingsFromDB() {
    try {
        await connectDB();
        const settings = await Settings.findOne({}).lean();

        if (!settings) {
            return null;
        }

        // Convert MongoDB _id to string for serialization
        return JSON.parse(JSON.stringify(settings));
    } catch (error) {
        console.error("Error fetching settings from DB:", error);
        return null;
    }
}

export function buildSiteConfig(settings) {
    // Build khaiwal sections from settings
    const khaiwalSection1 = settings?.khaiwalSection1 || {
        enabled: true,
        contactName: settings?.site1_contactName || settings?.contactName || "TEJU BHAI KHAIWAL",
        whatsappNumber: settings?.site1_whatsappNumber || settings?.whatsappNumber || "",
        paymentNumber: settings?.site1_paymentNumber || "",
        rate: settings?.site1_rate || "",
        gameSchedule: defaultGameSchedule
    };

    const khaiwalSection2 = settings?.khaiwalSection2 || {
        enabled: false,
        contactName: settings?.site2_contactName || "",
        whatsappNumber: settings?.site2_whatsappNumber || "",
        paymentNumber: settings?.site2_paymentNumber || "",
        rate: settings?.site2_rate || "",
        gameSchedule: defaultGameSchedule
    };

    // Site configuration with khaiwal sections
    return {
        siteName: "Satta Disawer Satta",
        contactName: settings?.site2_contactName || settings?.contactName || "",
        whatsappNumber: settings?.site2_whatsappNumber || settings?.whatsappNumber || "",
        paymentNumber: settings?.site2_paymentNumber || "",
        rate: settings?.site2_rate || "",
        // Khaiwal sections for bottom static section
        khaiwalSection1: {
            ...khaiwalSection1,
            gameSchedule: khaiwalSection1.gameSchedule?.length > 0
                ? khaiwalSection1.gameSchedule
                : defaultGameSchedule
        },
        khaiwalSection2: {
            ...khaiwalSection2,
            gameSchedule: khaiwalSection2.gameSchedule?.length > 0
                ? khaiwalSection2.gameSchedule
                : defaultGameSchedule
        }
    };
}
