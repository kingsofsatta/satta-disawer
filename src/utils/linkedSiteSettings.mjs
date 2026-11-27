export const linkedSites = {
  disawer: { name: "Satta Disawer", field: "disawer_khaiwalSection" },
  "result-24": { name: "Satta Raj Darbar / Satta King Result 24", field: "result24_khaiwalSection" },
};

export function getLinkedSection(settings, siteId, fallbackSchedule = []) {
  const site = linkedSites[siteId];
  if (!site) throw new Error("Unknown site");
  const section = settings?.[site.field] || settings?.khaiwalSection1 || {};
  return {
    enabled: section.enabled !== false,
    contactName: section.contactName ?? settings?.site1_contactName ?? settings?.contactName ?? "",
    whatsappNumber: section.whatsappNumber ?? settings?.site1_whatsappNumber ?? settings?.whatsappNumber ?? "",
    telegramNumber: section.telegramNumber ?? "",
    paymentNumber: section.paymentNumber ?? settings?.site1_paymentNumber ?? "",
    rate: section.rate ?? settings?.site1_rate ?? "",
    gameSchedule: section.gameSchedule?.length ? section.gameSchedule : fallbackSchedule,
  };
}

// Apply a site's override only after its first save; preserve existing settings otherwise.
export function applyLinkedSettings(settings, siteId) {
  const field = linkedSites[siteId]?.field;
  if (!field || !settings?.[field]) return settings;
  const section = getLinkedSection(settings, siteId);
  return {
    ...settings,
    khaiwalSection1: section,
    contactName: section.contactName,
    whatsappNumber: section.whatsappNumber,
    site2_whatsappNumber: section.whatsappNumber,
    site1_contactName: section.contactName,
    site1_whatsappNumber: section.whatsappNumber,
    site1_paymentNumber: section.paymentNumber,
    site1_rate: section.rate,
    disawarCta: { ...settings.disawarCta, whatsappNumber: section.whatsappNumber },
  };
}

export function validateLinkedSection(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid configuration");
  const section = { enabled: true };
  for (const key of ["contactName", "whatsappNumber", "telegramNumber", "paymentNumber", "rate"]) {
    if (typeof value[key] !== "string" || value[key].length > 500) throw new Error(`Invalid ${key}`);
    section[key] = value[key].trim();
  }
  if (!Array.isArray(value.gameSchedule) || !value.gameSchedule.length || value.gameSchedule.length > 100) {
    throw new Error("Add between 1 and 100 games to the chart");
  }
  section.gameSchedule = value.gameSchedule.map((game) => {
    if (typeof game?.name !== "string" || !game.name.trim() || game.name.length > 100 ||
        typeof game?.time !== "string" || !/^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(game.time.trim())) {
      throw new Error("Each game needs a name and a time such as 12:55 PM");
    }
    return { name: game.name.trim(), time: game.time.trim().toUpperCase() };
  });
  return section;
}
