import { Geist, Geist_Mono } from "next/font/google";
import SattaDashboard from "@/components/SattaDashboard";
import {
  getTodayResultFromDB,
  getYesterdayResultsFromDB,
  getLastResultFromDB,
  getMonthlyResultsFromDB,
  getDisawarDataFromDB,
} from "@/services/resultServer";
import { getSettingsFromDB, buildSiteConfig } from "@/services/settingsServer";

export const metadata = {
  title: "Good Luck Satta",
  description: "Satta Play - Satta Matka Results, Charts, and More",
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

  return (
    <SattaDashboard
      todayResults={todayResults}
      yesterdayResults={yesterdayResults}
      lastResult={lastResult}
      setting={siteConfig}
      monthlyResults={monthlyResults}
      disawarData={disawarData}
    />
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
