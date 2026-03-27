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

const SiteConfig = ({ showConfig, setShowConfig, onConfigSaved }) => {
  const [configLoading, setConfigLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const [siteConfig, setSiteConfig] = useState({
    // Legacy fields for backward compatibility
    site1_contactName: "",
    site1_whatsappNumber: "",
    site1_paymentNumber: "",
    site1_rate: "",
    site2_contactName: "",
    site2_whatsappNumber: "",
    site2_paymentNumber: "",
    site2_rate: "",
    contactName: "",
    whatsappNumber: "",
  });

  // Khaiwal sections state
  const [khaiwalSection1, setKhaiwalSection1] = useState({
    enabled: true,
    contactName: "",
    whatsappNumber: "",
    paymentNumber: "",
    rate: "",
    gameSchedule: [...defaultGameSchedule]
  });

  const [khaiwalSection2, setKhaiwalSection2] = useState({
    enabled: false,
    contactName: "",
    whatsappNumber: "",
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

  // Updated loadSiteConfig function
  const loadSiteConfig = async () => {
    try {
      const config = await getSettings();
      if (config) {
        setSiteConfig({
          site1_contactName: config.site1_contactName || config.contactName || "",
          site1_whatsappNumber: config.site1_whatsappNumber || config.whatsappNumber || "",
          site1_paymentNumber: config.site1_paymentNumber || "",
          site1_rate: config.site1_rate || "",
          site2_contactName: config.site2_contactName || "",
          site2_whatsappNumber: config.site2_whatsappNumber || "",
          site2_paymentNumber: config.site2_paymentNumber || "",
          site2_rate: config.site2_rate || "",
          contactName: config.contactName || "",
          whatsappNumber: config.whatsappNumber || "",
        });

        // Load khaiwal sections
        if (config.khaiwalSection1) {
          setKhaiwalSection1({
            enabled: config.khaiwalSection1.enabled !== false,
            contactName: config.khaiwalSection1.contactName || config.site1_contactName || "",
            whatsappNumber: config.khaiwalSection1.whatsappNumber || config.site1_whatsappNumber || "",
            paymentNumber: config.khaiwalSection1.paymentNumber || config.site1_paymentNumber || "",
            rate: config.khaiwalSection1.rate || config.site1_rate || "",
            gameSchedule: config.khaiwalSection1.gameSchedule?.length > 0
              ? config.khaiwalSection1.gameSchedule
              : [...defaultGameSchedule]
          });
        } else {
          // Fallback to site1 fields
          setKhaiwalSection1({
            enabled: true,
            contactName: config.site1_contactName || config.contactName || "",
            whatsappNumber: config.site1_whatsappNumber || config.whatsappNumber || "",
            paymentNumber: config.site1_paymentNumber || "",
            rate: config.site1_rate || "",
            gameSchedule: [...defaultGameSchedule]
          });
        }

        if (config.khaiwalSection2) {
          setKhaiwalSection2({
            enabled: config.khaiwalSection2.enabled || false,
            contactName: config.khaiwalSection2.contactName || config.site2_contactName || "",
            whatsappNumber: config.khaiwalSection2.whatsappNumber || config.site2_whatsappNumber || "",
            paymentNumber: config.khaiwalSection2.paymentNumber || config.site2_paymentNumber || "",
            rate: config.khaiwalSection2.rate || config.site2_rate || "",
            gameSchedule: config.khaiwalSection2.gameSchedule?.length > 0
              ? config.khaiwalSection2.gameSchedule
              : [...defaultGameSchedule]
          });
        } else {
          // Fallback to site2 fields
          setKhaiwalSection2({
            enabled: false,
            contactName: config.site2_contactName || "",
            whatsappNumber: config.site2_whatsappNumber || "",
            paymentNumber: config.site2_paymentNumber || "",
            rate: config.site2_rate || "",
            gameSchedule: [...defaultGameSchedule]
          });
        }
      }
    } catch (error) {
      console.error("Failed to load site config:", error);
    }
  };

  const handleConfigSave = async () => {
    setConfigLoading(true);
    try {
      // Sync legacy fields with khaiwal sections for backward compatibility
      const configToSave = {
        ...siteConfig,
        site2_name: "Satta Disawer Satta",
        site1_contactName: khaiwalSection1.contactName,
        site1_whatsappNumber: khaiwalSection1.whatsappNumber,
        site1_paymentNumber: khaiwalSection1.paymentNumber,
        site1_rate: khaiwalSection1.rate,
        site2_contactName: khaiwalSection2.contactName,
        site2_whatsappNumber: khaiwalSection2.whatsappNumber,
        site2_paymentNumber: khaiwalSection2.paymentNumber,
        site2_rate: khaiwalSection2.rate,
        khaiwalSection1,
        khaiwalSection2
      };

      await updateSettings(configToSave);
      alert("Site configuration saved successfully!");
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
  const addGame = (sectionNum) => {
    const setSection = sectionNum === 1 ? setKhaiwalSection1 : setKhaiwalSection2;
    const section = sectionNum === 1 ? khaiwalSection1 : khaiwalSection2;

    setSection({
      ...section,
      gameSchedule: [...section.gameSchedule, { name: "", time: "" }]
    });
  };

  const removeGame = (sectionNum, index) => {
    const setSection = sectionNum === 1 ? setKhaiwalSection1 : setKhaiwalSection2;
    const section = sectionNum === 1 ? khaiwalSection1 : khaiwalSection2;

    const newSchedule = section.gameSchedule.filter((_, i) => i !== index);
    setSection({
      ...section,
      gameSchedule: newSchedule
    });
  };

  const updateGame = (sectionNum, index, field, value) => {
    const setSection = sectionNum === 1 ? setKhaiwalSection1 : setKhaiwalSection2;
    const section = sectionNum === 1 ? khaiwalSection1 : khaiwalSection2;

    const newSchedule = [...section.gameSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSection({
      ...section,
      gameSchedule: newSchedule
    });
  };

  const renderKhaiwalSection = (sectionNum, section, setSection, colorClass) => {
    const isExpanded = expandedSection === sectionNum;

    return (
      <div className={`mb-6 p-4 bg-white/10 rounded-lg border border-white/20 ${!section.enabled && sectionNum === 2 ? 'opacity-60' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white text-lg flex items-center">
            <div className={`w-3 h-3 ${colorClass} rounded-full mr-2`}></div>
            Khaiwal Section {sectionNum}
          </h4>
          <div className="flex items-center gap-3">
            {sectionNum === 2 && (
              <label className="flex items-center cursor-pointer">
                <span className="text-white/70 text-sm mr-2">Enable</span>
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={(e) => setSection({ ...section, enabled: e.target.checked })}
                  className="w-5 h-5 rounded accent-green-500"
                  disabled={configLoading}
                />
              </label>
            )}
            <button
              onClick={() => setExpandedSection(isExpanded ? null : sectionNum)}
              className="text-white/70 hover:text-white p-1"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={section.contactName || ""}
              onChange={(e) => setSection({ ...section, contactName: e.target.value })}
              className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-${colorClass.replace('bg-', '')} transition-all duration-200`}
              placeholder="Enter khaiwal name (e.g., TEJU BHAI KHAIWAL)"
              disabled={configLoading || (sectionNum === 2 && !section.enabled)}
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">WhatsApp Number</label>
            <input
              type="number"
              value={section.whatsappNumber || ""}
              onChange={(e) => setSection({ ...section, whatsappNumber: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              placeholder="919999999999"
              disabled={configLoading || (sectionNum === 2 && !section.enabled)}
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Payment Number</label>
            <input
              type="text"
              value={section.paymentNumber || ""}
              onChange={(e) => setSection({ ...section, paymentNumber: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              placeholder="UPI/Phone number for payments"
              disabled={configLoading || (sectionNum === 2 && !section.enabled)}
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Rate (₹)</label>
            <input
              type="number"
              value={section.rate || ""}
              onChange={(e) => setSection({ ...section, rate: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              placeholder="e.g., 90"
              disabled={configLoading || (sectionNum === 2 && !section.enabled)}
            />
          </div>
        </div>

        {/* Game Schedule - Collapsible */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between mb-3">
              <label className="text-white/80 text-sm font-medium">Game Schedule</label>
              <button
                onClick={() => addGame(sectionNum)}
                disabled={configLoading || (sectionNum === 2 && !section.enabled)}
                className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm disabled:opacity-50"
              >
                <Plus size={16} /> Add Game
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {section.gameSchedule.map((game, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={game.name}
                    onChange={(e) => updateGame(sectionNum, index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Game name"
                    disabled={configLoading || (sectionNum === 2 && !section.enabled)}
                  />
                  <input
                    type="text"
                    value={game.time}
                    onChange={(e) => updateGame(sectionNum, index, 'time', e.target.value)}
                    className="w-28 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Time"
                    disabled={configLoading || (sectionNum === 2 && !section.enabled)}
                  />
                  <button
                    onClick={() => removeGame(sectionNum, index)}
                    disabled={configLoading || (sectionNum === 2 && !section.enabled)}
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
    );
  };

  if (!showConfig) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-white text-xl mb-6">Khaiwal Sections Configuration</h3>

        <p className="text-white/70 text-sm mb-4">
          Configure up to 2 khaiwal sections. Each section can have its own name, WhatsApp number, rate, and game schedule.
        </p>

        {/* Khaiwal Section 1 */}
        {renderKhaiwalSection(1, khaiwalSection1, setKhaiwalSection1, "bg-blue-400")}

        {/* Khaiwal Section 2 */}
        {renderKhaiwalSection(2, khaiwalSection2, setKhaiwalSection2, "bg-green-400")}

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
              "Save All Configurations"
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

export default SiteConfig;
