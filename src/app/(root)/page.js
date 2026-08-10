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
import {
  getFirebaseCustomGames,
  getFirebaseScrapedCache,
} from "@/services/firebaseGameService";

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
  const newestFetch = Math.max(
    0,
    ...externalGames.map((game) => new Date(game.fetchedAt).getTime() || 0),
  );
  const needsRefresh =
    externalGames.length < 6 || Date.now() - newestFetch >= 15 * 60 * 1000;

  if (needsRefresh) {
    // Trigger external games fetch (with built-in cooldown)
    await triggerExternalGamesFetch();
    externalGames = await getExternalGames();
  }

  // Get current month's results
  const currentDate = new Date();
  const [monthlyResults, firebaseCustomGames, firebaseScrapedCache] = await Promise.all([
    getMonthlyResultsFromDB(
      currentDate.getMonth() + 1,
      currentDate.getFullYear(),
    ),
    getFirebaseCustomGames(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
    ).catch((error) => {
      console.error("Failed to fetch Firebase custom games:", error.message);
      return { columns: [], rows: [] };
    }),
    getFirebaseScrapedCache(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
    ).catch((error) => {
      console.error("Failed to fetch Firebase scraped cache:", error.message);
      return { homepageGames: [], chart: null };
    }),
  ]);

  // Build site config with khaiwal sections
  const siteConfig = buildSiteConfig(settings);

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.sattadisawer.com/#website",
        "url": "https://www.sattadisawer.com/",
        "name": "Satta Disawer",
        "description": "Satta Disawer provides daily result updates, charts and historical records for popular markets.",
        "inLanguage": "en-IN",
        "publisher": {
          "@id": "https://www.sattadisawer.com/#organization"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://www.sattadisawer.com/#organization",
        "name": "Satta Disawer",
        "url": "https://www.sattadisawer.com/"
      },
      {
        "@type": "WebPage",
        "@id": "https://www.sattadisawer.com/#webpage",
        "url": "https://www.sattadisawer.com/",
        "name": "Today Satta Result for All Satta Games | SattaDisawer.Com",
        "description": "Check daily Satta Disawer results, Satta King charts, market updates and historical result records.",
        "isPartOf": {
          "@id": "https://www.sattadisawer.com/#website"
        },
        "about": {
          "@id": "https://www.sattadisawer.com/#organization"
        },
        "inLanguage": "en-IN"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.sattadisawer.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.sattadisawer.com/"
          }
        ]
      },
    ]
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
      firebaseCustomGames={firebaseCustomGames}
      firebaseScrapedCache={firebaseScrapedCache}
    />
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
