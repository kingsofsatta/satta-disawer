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
import { getExternalGames } from "@/services/externalGameService";
import { triggerExternalGamesFetch } from "@/lib/triggerExternalGamesFetch";

// Generate dynamic metadata
export async function generateMetadata() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const dayWithSuffix = day + (day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th');
  const monthName = currentDate.toLocaleDateString('en-GB', { month: 'long' });
  const year = currentDate.getFullYear();
  const dayName = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });
  
  const formattedDate = `${dayWithSuffix} ${monthName} ${year}`;
  
  const title = `Satta King Winning Result ${formattedDate}`;
  const description = `Check fast Satta King results for ${dayName}, ${day} ${monthName} ${year}. Get live updates for Gali, Faridabad, Ghaziabad & Delhi Bazar. View today's winning numbers live!`;
  
  return {
    title,
    description,
    keywords: [
      "satta disawer today",
      "satta result today",
      "disawer result today",
      "gali result today",
      "satta king today",
      "live satta result",
      "satta matka live",
      "today satta number"
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sattadisawer.com',
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

  let externalGames = await getExternalGames();
  
  // Trigger fetch with cooldown (15 minutes) - provides frequent updates without overwhelming the source
  const needsRefresh =
    externalGames.length === 0 ||
    externalGames.some(
      (game) => game.todayResult == null || game.yesterdayResult == null,
    );

  if (needsRefresh) {
    // Trigger external games fetch (with built-in cooldown)
    await triggerExternalGamesFetch();
    externalGames = await getExternalGames();
  }

  // Get current month's results
  const currentDate = new Date();
  const monthlyResults = await getMonthlyResultsFromDB(
    currentDate.getMonth() + 1,
    currentDate.getFullYear()
  );

  // Build site config with khaiwal sections
  const siteConfig = buildSiteConfig(settings);

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Satta Disawer",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.sattadisawer.com",
    "description": "Get fast and accurate Satta Disawer results, charts, and predictions. Live updates for all Satta Matka games.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.sattadisawer.com"}/chart?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
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
      externalGames={externalGames}
    />
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
