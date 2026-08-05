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

export const metadata = {
  title: "Satta Disawer | Live Satta Matka Results Today",
  description: "Get instant Satta Disawer results today. Live updates for Disawer, Gali, Faridabad, Delhi Bazar & all Satta Matka games. Check latest charts, predictions & winning numbers.",
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
    title: "Satta Disawer | Live Satta Matka Results Today",
    description: "Get instant Satta Disawer results today. Live updates for all Satta Matka games.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Satta Disawer | Live Satta Matka Results Today",
    description: "Get instant Satta Disawer results today. Live updates for all Satta Matka games.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sattadisawer.com',
  },
};

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

  console.log("Settings from DB:", settings?.khaiwalSection1 ? "Section1 present" : "Section1 missing");
  console.log("Settings from DB:", settings?.khaiwalSection2 ? "Section2 present" : "Section2 missing");

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
      />
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
