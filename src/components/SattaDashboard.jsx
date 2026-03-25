"use client";
import { GAMES } from "@/utils/gameConfig";
import { Typewriter } from "react-simple-typewriter";
import GameSection from "./GameSection";
import SattaResultTable from "./SattaResultTable";
import SimpleFAQ from "./SimpleFAQ";

const SattaDashboard = ({
  todayResults = [],
  yesterdayResults = [],
  lastResult,
  setting,
  monthlyResults = [],
  disawarData,
  currentSite = "site 3",
  siteName = "Good Luck Satta",
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toUpperCase();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Use site name from settings or props
  const displaySiteName = setting?.siteName || siteName;

  // Get current day of the month
  const currentDay = currentDate.getDate();

  // Create monthly chart data using centralized config
  const createMonthlyChart = () => {
    const rows = [];
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");

    // Only show rows up to current day
    for (let day = 1; day <= currentDay; day++) {
      const row = { day };
      const dayStr = `${currentYear}-${monthStr}-${String(day).padStart(2, "0")}`;

      GAMES.forEach((game, index) => {
        // Find result for this specific date and game
        const result = monthlyResults.find(
          (r) => r.date === dayStr && r.game === game.key
        );
        row[`game${index}`] = result ? result.resultNumber : "--";
      });

      rows.push(row);
    }
    return rows;
  };

  const monthlyChartData = createMonthlyChart();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <div className="mx-auto">
        {/* Current Featured Game */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-violet-700 to-violet-600 py-4">
            <p className="text-xl md:text-2xl font-bold text-white hindi-text">
              <Typewriter
                words={["ईमानदारी ही हमारी पहचान है।"]}
                cursor
                cursorBlinking={false}
                cursorStyle=""
                typeSpeed={80}
              />
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-5 shadow-lg shadow-amber-500/20">
            <h2 className="text-3xl px-3 lg:text-4xl text-slate-900 font-black tracking-tight">
              {displaySiteName}
            </h2>
          </div>
          {/* Live Results Banner */}
          <div className="bg-gradient-to-r from-violet-700 via-violet-600 to-violet-700 py-2">
            <p className="text-lg md:text-xl font-bold italic text-amber-400 text-center">
              Live Dpboss Kalyan Satta Matka Result.
            </p>
          </div>
          <div className="bg-slate-800 py-4 px-4">
            <p className="text-sm md:text-base text-center text-slate-300 leading-relaxed">
              You are welcome to dpbosss.net.in, the most popular site on Satta Matka. Loyalty program, instant games, all-free Kalyan, Milan, Rajdhani, Ratan, and Main Bazar games. We are a global DP Boss and the top-ranking. Competition: Matka results See fast Matka results in the Matka chart. It is the leading Matka site where DpBoss guessed. Take the last ank and individual open predictions each day.
            </p>
            <p className="text-lg md:text-xl font-bold italic text-amber-400 text-center mt-3">
              The current Dpboss Kalyan Satta Matka Results.
            </p>
          </div>
        </div>

        <GameSection
          data={lastResult}
          setting={setting}
          disawarData={disawarData}
        />
        <SattaResultTable
          todayResults={todayResults}
          yesterdayResults={yesterdayResults}
        />

        {/* Chart Grid */}
        <div className="mt-8 px-2 md:px-4">
          <div className="bg-gradient-to-r from-violet-700 to-violet-600 rounded-t-2xl py-5 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold flex items-center justify-center gap-3">
              <span>📅</span>
              <span>{currentMonth} MONTH CHART {currentYear}</span>
              <span>📅</span>
            </h2>
          </div>

          <div className="overflow-x-auto bg-slate-900 rounded-b-2xl shadow-sm border border-slate-700">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800">
                  <th className="border border-slate-700 px-3 py-3 text-violet-400 text-sm font-bold sticky left-0 bg-slate-800 z-10">
                    S.No
                  </th>
                  {GAMES.map((game, index) => (
                    <th
                      key={index}
                      className="border border-slate-700 px-3 py-3 text-slate-300 text-xs font-semibold whitespace-nowrap"
                    >
                      {game.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyChartData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-slate-700/50 transition-colors duration-200 bg-slate-800/50"
                  >
                    <td className="border border-slate-700 px-3 py-2.5 text-center text-amber-500 text-sm font-bold sticky left-0 bg-slate-800 z-10">
                      {rowIndex + 1}
                    </td>
                    {GAMES.map((_, gameIndex) => (
                      <td
                        key={gameIndex}
                        className="border border-slate-700 px-3 py-2.5 hover:bg-violet-900/30 transition-colors text-center text-violet-400 text-sm font-medium"
                      >
                        {row[`game${gameIndex}`]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Decorative */}
        <div className="py-8 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-violet-400 to-transparent rounded-full"></div>
        </div>

        {/* FAQ Section */}
        <SimpleFAQ />

        {/* Footer Spacing */}
        <div className="py-8 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-violet-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SattaDashboard;
