export const DEFAULT_HOMEPAGE_SETTINGS = {
  homepageTitle:
    "Satta King Result 1 Today {date} | sattakingresult1.com",
  metaTitle: "Satta King Winning Result {date}",
  metaDescription:
    "Check fast Satta King results for {day}, {date}. Get live updates for Gali, Faridabad, Ghaziabad & Delhi Bazar. View today's winning numbers live!",
};

export function getHomepageDateValues(date = new Date()) {
  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const dayFormatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  });

  return {
    date: dateFormatter.format(date),
    day: dayFormatter.format(date),
    year: dateFormatter.formatToParts(date).find((part) => part.type === "year")
      ?.value,
  };
}

export function applyHomepagePlaceholders(value, date = new Date()) {
  const replacements = getHomepageDateValues(date);

  return String(value || "")
    .replaceAll("{date}", replacements.date)
    .replaceAll("{day}", replacements.day)
    .replaceAll("{year}", replacements.year || "");
}

export function mergeHomepageSettings(settings) {
  return {
    homepageTitle:
      settings?.homepageTitle || DEFAULT_HOMEPAGE_SETTINGS.homepageTitle,
    metaTitle: settings?.metaTitle || DEFAULT_HOMEPAGE_SETTINGS.metaTitle,
    metaDescription:
      settings?.metaDescription || DEFAULT_HOMEPAGE_SETTINGS.metaDescription,
  };
}
