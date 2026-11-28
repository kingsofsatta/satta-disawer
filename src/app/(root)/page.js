import { Geist, Geist_Mono } from "next/font/google";
import SattaDashboard from "@/components/SattaDashboard";
import StructuredData from "@/components/StructuredData";
import {
  getTodayResultFromDB,
  getYesterdayResultsFromDB,
  getLastResultFromDB,
  getMonthlyResultsFromDB,
  getDisawarDataFromDB,
} from "@/services/resultServer";
import { getSettingsFromDB, buildSiteConfig } from "@/services/settingsServer";
import { getExtraGames } from "@/services/extraGameService";
import { getExternalGames } from "@/services/externalGameService";
import {
  applyHomepagePlaceholders,
  mergeHomepageSettings,
} from "@/utils/homepageSettings";

const normalizeGameName = (name) =>
  String(name || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

const mergeExternalGames = (extraGames, externalGames) => {
  const displayGames = externalGames.map((game) => ({
    id: `a7satta-${normalizeGameName(game.name).replace(/\s+/g, "-").toLowerCase()}`,
    name: game.name,
    time: game.time,
    yesterday: game.yesterdayResult || "--",
    today: game.todayResult || "--",
  }));
  const externalGameNames = new Set(
    displayGames.map((game) => normalizeGameName(game.name)),
  );

  return [
    ...displayGames,
    ...extraGames.filter(
      (game) => !externalGameNames.has(normalizeGameName(game.name)),
    ),
  ];
};

// Generate dynamic metadata
export async function generateMetadata() {
  const settings = await getSettingsFromDB();
  const homepageSettings = mergeHomepageSettings(settings);
  const title = applyHomepagePlaceholders(homepageSettings.metaTitle);
  const description = applyHomepagePlaceholders(
    homepageSettings.metaDescription,
  );

  return {
    title: { absolute: title },
    description,
    keywords: [
      "Satta King Result 1 today",
      "satta result today",
      "disawer result today",
      "gali result today",
      "satta king today",
      "live satta result",
      "satta matka live",
      "today satta number",
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical:
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.sattakingresult1.com",
    },
  };
}

export default async function Home() {
  // Fetch all data directly from database
  const [todayResults, yesterdayResults, lastResult, disawarData, settings] =
    await Promise.all([
      getTodayResultFromDB(),
      getYesterdayResultsFromDB(),
      getLastResultFromDB(),
      getDisawarDataFromDB(),
      getSettingsFromDB(),
    ]);

  // Get current month's results
  const currentDate = new Date();
  const [monthlyResults, databaseExtraGames, externalGames] = await Promise.all(
    [
      getMonthlyResultsFromDB(
        currentDate.getMonth() + 1,
        currentDate.getFullYear(),
      ),
      getExtraGames().catch((error) => {
        console.error(
          "Failed to fetch extra games from MongoDB:",
          error.message,
        );
        return [];
      }),
      getExternalGames().catch((error) => {
        console.error(
          "Failed to fetch A7Satta games from MongoDB:",
          error.message,
        );
        return [];
      }),
    ],
  );
  const extraGames = mergeExternalGames(databaseExtraGames, externalGames);

  // Build site config with khaiwal sections
  const siteConfig = buildSiteConfig(settings);

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.sattakingresult1.com/#website",
        url: "https://www.sattakingresult1.com/",
        name: "Satta King Result 1",
        description:
          "Satta King Result 1 provides daily result updates, charts and historical records for popular markets.",
        inLanguage: "en-IN",
        publisher: {
          "@id": "https://www.sattakingresult1.com/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.sattakingresult1.com/#organization",
        name: "Satta King Result 1",
        url: "https://www.sattakingresult1.com/",
      },
      {
        "@type": "WebPage",
        "@id": "https://www.sattakingresult1.com/#webpage",
        url: "https://www.sattakingresult1.com/",
        name: "Today Satta Result for All Satta Games | sattakingresult1.com",
        description:
          "Check daily Satta King Result 1 results, Satta King charts, market updates and historical result records.",
        isPartOf: {
          "@id": "https://www.sattakingresult1.com/#website",
        },
        about: {
          "@id": "https://www.sattakingresult1.com/#organization",
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.sattakingresult1.com/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.sattakingresult1.com/",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <SattaDashboard
        todayResults={todayResults}
        yesterdayResults={yesterdayResults}
        lastResult={lastResult}
        setting={siteConfig}
        monthlyResults={monthlyResults}
        disawarData={disawarData}
        extraGames={extraGames}
      />
    </>
  );
}

// Serve cached HTML immediately and refresh it in the background frequently.
export const revalidate = 30;
