import { notFound } from "next/navigation";
import Heading from "@/components/common/Heading";
import YearlyTable from "@/components/YearlyTable";
import {
  getYearlyResultsFromDB,
  transformYearlyData,
  gameSlugMapping,
  parseSlugData,
} from "@/services/resultServer";
import { getExtraGamesMonthlyArchive } from "@/services/extraGameService";

const EXTRA_GAME_CHART_KEYS = {
  disawer: "dswr",
  "delhi-bazar": "dlbz",
  "shri-ganesh": "srgn",
  faridabad: "frbd",
  gaziyabad: "gzbd",
  gali: "gali",
};

const mergeExtraGamesArchive = (yearlyData, gameKey, archives) => {
  const resultKey = EXTRA_GAME_CHART_KEYS[gameKey];
  if (!resultKey) return yearlyData;

  ["JAN", "FEB"].forEach((month, index) => {
    for (const row of archives[index]?.chart?.rows || []) {
      const value = row.results?.[resultKey];
      if (value && value !== "--" && !yearlyData[month]?.[row.day]) {
        yearlyData[month][row.day] = value;
      }
    }
  });

  return yearlyData;
};

// Generate metadata for dynamic pages
export async function generateMetadata({ params }) {
  const { slug } = params;
  const slugData = parseSlugData(slug);
  
  if (!slugData) {
    return {
      title: 'Page Not Found',
    };
  }

  const { name: gameName, year } = slugData;
  
  return {
    title: `${gameName} Chart ${year} | Yearly Record Chart`,
    description: `View complete ${gameName} yearly chart for ${year}. Get accurate historical results, patterns, and trends for ${gameName} Satta Matka game.`,
    keywords: [
      `${gameName.toLowerCase()} chart`,
      `${gameName.toLowerCase()} ${year}`,
      `${gameName.toLowerCase()} result`,
      `satta ${gameName.toLowerCase()}`,
      `${gameName.toLowerCase()} yearly chart`,
    ],
    openGraph: {
      title: `${gameName} Chart ${year} | Yearly Record Chart`,
      description: `View complete ${gameName} yearly chart for ${year}. Get accurate historical results and patterns.`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sattadisawer.com'}/${slug}`,
    },
  };
}

const DynamicTable = async ({ params }) => {
  const { slug } = params;

  // Get game key and display info from slug
  const gameKey = gameSlugMapping[slug];
  const slugData = parseSlugData(slug);

  if (!gameKey || !slugData) {
    notFound();
  }

  const { name: gameName, year } = slugData;

  // Fetch yearly data directly from database
  const [results, januaryArchive, februaryArchive] = await Promise.all([
    getYearlyResultsFromDB(gameKey, year),
    getExtraGamesMonthlyArchive(Number(year), 1).catch(() => ({ chart: null })),
    getExtraGamesMonthlyArchive(Number(year), 2).catch(() => ({ chart: null })),
  ]);
  const yearlyData = mergeExtraGamesArchive(
    transformYearlyData(results),
    gameKey,
    [januaryArchive, februaryArchive],
  );

  return (
    <div>
      <Heading title={`${gameName} YEARLY CHART ${year}`} />
      <div className="mx-auto px-4 py-6">
        <YearlyTable year={year} data={yearlyData} />
      </div>
    </div>
  );
};

export default DynamicTable;

export const dynamic = "force-dynamic";
export const revalidate = 0;
