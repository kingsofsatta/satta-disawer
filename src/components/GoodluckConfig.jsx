"use client";
import React, { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/services/result";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

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

const GoodluckConfig = ({ showConfig, setShowConfig, onConfigSaved }) => {
    const [configLoading, setConfigLoading] = useState(false);
    const [expandedSection, setExpandedSection] = useState(null);

    const [siteConfig, setSiteConfig] = useState({
        contactName: "",
        whatsappNumber: "",
        paymentNumber: "",
        rate: "",
    });

    // Khaiwal section state
    const [khaiwalSection, setKhaiwalSection] = useState({
        contactName: "",
        whatsappNumber: "",
        telegramNumber: "",
        paymentNumber: "",
        rate: "",
        gameSchedule: [...defaultGameSchedule]
    });

    // Load configuration when component mounts or showConfig changes
    useEffect(() => {
        if (showConfig) {
            loadSiteConfig();
        }
    }, [showConfig]);

    const loadSiteConfig = async () => {
        try {
            const config = await getSettings();
            if (config) {
                setSiteConfig({
                    contactName: config.goodluck_contactName || "",
                    whatsappNumber: config.goodluck_whatsappNumber || "",
                    paymentNumber: config.goodluck_paymentNumber || "",
                    rate: config.goodluck_rate || "",
                });

                // Load khaiwal section
                setKhaiwalSection({
                    contactName: config.goodluck_khaiwalSection?.contactName || config.goodluck_contactName || "",
                    whatsappNumber: config.goodluck_khaiwalSection?.whatsappNumber || config.goodluck_whatsappNumber || "",
                    telegramNumber: config.goodluck_khaiwalSection?.telegramNumber || "",
                    paymentNumber: config.goodluck_khaiwalSection?.paymentNumber || config.goodluck_paymentNumber || "",
                    rate: config.goodluck_khaiwalSection?.rate || config.goodluck_rate || "",
                    gameSchedule: config.goodluck_khaiwalSection?.gameSchedule?.length > 0
                        ? config.goodluck_khaiwalSection.gameSchedule
                        : [...defaultGameSchedule]
                });
            }
        } catch (error) {
            console.error("Failed to load site config:", error);
        }
    };

    const handleConfigSave = async () => {
        setConfigLoading(true);
        try {
            const configToSave = {
                goodluck_contactName: khaiwalSection.contactName,
                goodluck_whatsappNumber: khaiwalSection.whatsappNumber,
                goodluck_paymentNumber: khaiwalSection.paymentNumber,
                goodluck_rate: khaiwalSection.rate,
                goodluck_khaiwalSection: khaiwalSection
            };

            await updateSettings(configToSave);
            alert("Good Luck site configuration saved successfully!");
            setShowConfig(false);
            if (onConfigSaved) {
                onConfigSaved();
            }
        } catch (error) {
            console.error("Failed to save config:", error);
            alert("Failed to save configuration. Please try again.");
        } finally {
            setConfigLoading(false);
        }
    };

    // Game schedule handlers
    const addGame = () => {
        setKhaiwalSection({
            ...khaiwalSection,
            gameSchedule: [...khaiwalSection.gameSchedule, { name: "", time: "" }]
        });
    };

    const removeGame = (index) => {
        const newSchedule = khaiwalSection.gameSchedule.filter((_, i) => i !== index);
        setKhaiwalSection({
            ...khaiwalSection,
            gameSchedule: newSchedule
        });
    };

    const updateGame = (index, field, value) => {
        const newSchedule = [...khaiwalSection.gameSchedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setKhaiwalSection({
            ...khaiwalSection,
            gameSchedule: newSchedule
        });
    };

    if (!showConfig) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-white text-xl mb-6">Good Luck Site Configuration</h3>

                <p className="text-white/70 text-sm mb-4">
                    Configure the khaiwal section for Good Luck site.
                </p>

                {/* Khaiwal Section */}
                <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white text-lg flex items-center">
                            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                            Khaiwal Section
                        </h4>
                        <button
                            onClick={() => setExpandedSection(expandedSection === 'khaiwal' ? null : 'khaiwal')}
                            className="text-white/70 hover:text-white p-1"
                        >
                            {expandedSection === 'khaiwal' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={khaiwalSection.contactName || ""}
                                onChange={(e) => setKhaiwalSection({ ...khaiwalSection, contactName: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                                placeholder="Enter khaiwal name (e.g., TEJU BHAI KHAIWAL)"
                                disabled={configLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">WhatsApp Number</label>
                            <input
                                type="number"
                                value={khaiwalSection.whatsappNumber || ""}
                                onChange={(e) => setKhaiwalSection({ ...khaiwalSection, whatsappNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                                placeholder="919999999999"
                                disabled={configLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Telegram Username</label>
                            <input
                                type="text"
                                value={khaiwalSection.telegramNumber || ""}
                                onChange={(e) => setKhaiwalSection({ ...khaiwalSection, telegramNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                                placeholder="telegram_username (without @)"
                                disabled={configLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Payment Number</label>
                            <input
                                type="text"
                                value={khaiwalSection.paymentNumber || ""}
                                onChange={(e) => setKhaiwalSection({ ...khaiwalSection, paymentNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                                placeholder="UPI/Phone number for payments"
                                disabled={configLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">Rate (₹)</label>
                            <input
                                type="number"
                                value={khaiwalSection.rate || ""}
                                onChange={(e) => setKhaiwalSection({ ...khaiwalSection, rate: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
                                placeholder="e.g., 90"
                                disabled={configLoading}
                            />
                        </div>
                    </div>

                    {/* Game Schedule - Collapsible */}
                    {expandedSection === 'khaiwal' && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-white/80 text-sm font-medium">Game Schedule</label>
                                <button
                                    onClick={addGame}
                                    disabled={configLoading}
                                    className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm disabled:opacity-50"
                                >
                                    <Plus size={16} /> Add Game
                                </button>
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {khaiwalSection.gameSchedule.map((game, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={game.name}
                                            onChange={(e) => updateGame(index, 'name', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                                            placeholder="Game name"
                                            disabled={configLoading}
                                        />
                                        <input
                                            type="text"
                                            value={game.time}
                                            onChange={(e) => updateGame(index, 'time', e.target.value)}
                                            className="w-28 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                                            placeholder="Time"
                                            disabled={configLoading}
                                        />
                                        <button
                                            onClick={() => removeGame(index)}
                                            disabled={configLoading}
                                            className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-white/20">
                    <button
                        onClick={handleConfigSave}
                        disabled={configLoading}
                        className="flex-1 bg-gradient2 text-white py-3 px-4 rounded-lg roboto hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {configLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Saving...
                            </div>
                        ) : (
                            "Save Configuration"
                        )}
                    </button>
                    <button
                        onClick={() => setShowConfig(false)}
                        disabled={configLoading}
                        className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoodluckConfig;