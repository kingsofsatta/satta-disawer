"use client";
import { GAMES } from "@/utils/gameConfig";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import FirebaseScrapedCacheTables from "./FirebaseScrapedCacheTables";
import GameSection from "./GameSection";
import SattaResultTable from "./SattaResultTable";
import SimpleFAQ from "./SimpleFAQ";

const COMPLAINT_NUMBER = "94991 94846";
const COMPLAINT_MESSAGE = encodeURIComponent(
  "नमस्ते, मुझे भुगतान या किसी अन्य समस्या के संबंध में शिकायत दर्ज करनी है।",
);

const SattaDashboard = ({
  todayResults = [],
  yesterdayResults = [],
  lastResult,
  setting,
  monthlyResults = [],
  disawarData,
  externalGames = [],
  firebaseScrapedCache = { homepageGames: [], chart: null },
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate
    .toLocaleString("default", { month: "long" })
    .toUpperCase();

  // Format date as "05 August 2026"
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Get current day of the month
  const currentDay = currentDate.getDate();
  const telegramNumber = "123456789";

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
          (r) => r.date === dayStr && r.game === game.key,
        );
        row[`game${index}`] = result ? result.resultNumber : "--";
      });

      rows.push(row);
    }
    return rows;
  };

  const monthlyChartData = createMonthlyChart();
  console.log(firebaseScrapedCache,"firebaseScrapedCache");
  return (
    <div className="min-h-screen bg-transparent">
      {/* Main Content */}
      <div className="mx-auto">
        {/* Current Featured Game */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-violet-700 to-violet-600 py-2 sm:py-4">
            <p className="sm:text-xl text-lg md:text-2xl font-bold text-white hindi-text">
              <Typewriter
                words={["ईमानदारी ही हमारी पहचान है।"]}
                cursor
                cursorBlinking={false}
                cursorStyle=""
                typeSpeed={80}
              />
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-2 sm:py-5 shadow-lg shadow-amber-500/20">
            <h1 className="sm:text-3xl text-2xl px-3 lg:text-4xl text-slate-900 font-black tracking-tight">
              Satta Desawar Result Today {formattedDate} |{" "}
              <Link href="https://www.sattadisawer.com">SattaDisawer.Com</Link>
            </h1>
          </div>

          {/* Disclaimer */}
          <div className="bg-red-900/30 border-2 border-red-500/50 py-3 px-4 my-3 rounded-lg mx-2">
            <p className="text-sm md:text-base text-center text-red-200 leading-relaxed">
              <strong>Disclaimer:</strong> This website is strictly for news and
              informational purposes. We have no link to any company or market
              mentioned and do not offer any paid services. Users must follow
              their local laws.{" "}
              <Link
                href="/terms"
                className="text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
              >
                Read more
              </Link>
            </p>
          </div>

          {/* Live Results Banner */}
          <div className="bg-gradient-to-r from-violet-700 via-violet-600 to-violet-700 py-2">
            <p className="text-lg md:text-xl font-bold italic text-amber-400 text-center">
              Satta King Live Results
            </p>
          </div>
        </div>

        <GameSection
          data={lastResult}
          setting={setting}
          disawarData={disawarData}
          todayResults={todayResults}
        />
        <SattaResultTable
          todayResults={todayResults}
          yesterdayResults={yesterdayResults}
          externalGames={externalGames}
        />

        {/* Chart Grid */}
        <div className="mt-8 px-2 md:px-4">
          <div className="bg-gradient-to-r from-violet-700 to-violet-600 rounded-t-2xl py-5 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold flex items-center justify-center gap-3">
              <span>📅</span>
              <span>
                {currentMonth} MONTH CHART {currentYear}
              </span>
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

        {/* <FirebaseMonthlyTable
          data={firebaseCustomGames}
          month={currentMonth}
          year={currentYear}
        /> */}

        <FirebaseScrapedCacheTables data={firebaseScrapedCache} />

        {/* Additional Content Section */}
        <div className="mt-12 px-2 md:px-4">
          <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-700">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4">
              Fast Satta Result – Live Satta King Chart 2026 & Daily Records
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              <strong>SattaDisawer.com</strong> is a leading online news and
              media platform providing real-time{" "}
              <strong>live Satta result</strong> updates,{" "}
              <strong>Satta King chart</strong> records, and daily market
              historical data. Designed with a clean, fast-loading, and
              user-friendly interface, our website allows visitors to quickly
              check opening and closing numbers for all major markets in one
              convenient location. Whether you are searching for{" "}
              <strong>today Satta result</strong>, historical month-wise record
              charts, or fast updates, <strong>SattaDisawer.com</strong>{" "}
              delivers accurate information as soon as draws are officially
              published.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 mt-8">
              Real-Time Satta King Today Result Updates
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Tracking daily market outcomes requires speed and accuracy. Our
              platform updates <strong>live Satta Matka result</strong> data
              automatically throughout the day according to official timing
              schedules. Users can easily track previous results alongside newly
              declared numbers without needing to refresh multiple pages or
              search across different websites.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-violet-400 mb-4">
              Key Features of Our Platform:
            </h3>
            <ul className="list-disc list-inside text-slate-300 space-y-3 mb-6">
              <li>
                <strong>Superfast Live Updates:</strong> Instant publishing of{" "}
                <strong>daily result updates</strong> as soon as market numbers
                are declared.
              </li>
              <li>
                <strong>Organized Record Tables:</strong> Clear layout comparing
                yesterday's numbers with <strong>today Satta result</strong>{" "}
                data.
              </li>
              <li>
                <strong>Mobile-Optimized Design:</strong> Smooth navigation for
                quick access on smartphones and tablets.
              </li>
              <li>
                <strong>Free Informational Access:</strong> All charts, daily
                logs, and historical archives are completely free to view.
              </li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 mt-8">
              Comprehensive Satta King 2026 Record Charts
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Maintaining an accurate <strong>Satta King 2026 record</strong> is
              essential for users who track past trends and historical patterns.
              Our comprehensive <strong>Satta result chart</strong> archive
              organizes past draw outcomes by year, month, and date, making
              long-term data review simple and accessible.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-violet-400 mb-4">
              What You Will Find in Our Chart Section:
            </h3>
            <ol className="list-decimal list-inside text-slate-300 space-y-3 mb-6">
              <li>
                <strong>Monthly Result Charts:</strong> Complete month-by-month
                tables showing full daily sequence data for 2026.
              </li>
              <li>
                <strong>Yearly Archives:</strong> Access to historical result
                logs from 2026, 2025, 2024, and earlier years.
              </li>
              <li>
                <strong>Structured Layout:</strong> Clean table format designed
                for easy trend analysis and historical reference.
              </li>
            </ol>
            <p className="text-slate-300 leading-relaxed mb-6">
              By keeping yearly records neatly categorized in structured grids,{" "}
              <strong>SattaDisawer.com</strong> eliminates the hassle of
              searching through fragmented sources to find reliable{" "}
              <strong>Satta Matka chart</strong> data.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 mt-8">
              Why Choose SattaDisawer.com for Daily Results?
            </h2>
            <p className="text-slate-300 leading-relaxed">
              When searching for reliable <strong>fast Satta result</strong>{" "}
              websites, speed and clarity matter most.{" "}
              <strong>SattaDisawer.com</strong> aggregates public internet
              records into a single, organized informational database. Users
              rely on our site because we offer non-stop daily updates,
              organized history charts, and an easy-to-read table structure
              tailored for quick browsing.
            </p>
          </div>
        </div>

        {/* Bottom Decorative */}
        <div className="py-8 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-violet-400 to-transparent rounded-full"></div>
        </div>

        {/* FAQ Section */}
        <SimpleFAQ />
        <div className="flex flex-col justify-center items-center mt-5 gap-2">
          <p className="text-center text-violet-100 text-base mb-1 mt-2 hindi-text">
            Join our Telegram channel to get results quickly and receive
            superfast results:
          </p>
          {telegramNumber && (
            <Link
              target="_blank"
              href={`https://t.me/${telegramNumber}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 btn-glow"
            >
              <span>
                <Image
                  src="/telegram-icon.webp"
                  height={24}
                  width={24}
                  alt="Telegram"
                />
              </span>
              <span className="hindi-text">Telegram पर संपर्क करें</span>
            </Link>
          )}
        </div>

        {/* Compact Complaint Section */}
        <section
          aria-labelledby="home-complaint-heading"
          className="mx-2 mt-8 rounded-2xl border border-green-500/30 bg-slate-900/90 p-5 text-center shadow-lg shadow-green-950/20 md:mx-4 md:p-6"
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
            <MessageCircle aria-hidden="true" className="h-7 w-7" />
          </div>
          <h2
            id="home-complaint-heading"
            className="hindi-text text-xl font-black text-white md:text-2xl"
          >
            भुगतान से जुड़ी शिकायत है?
          </h2>
          <p className="hindi-text mx-auto mt-2 max-w-xl text-base leading-7 text-slate-300">
            भुगतान न मिलने या किसी अन्य समस्या के लिए हमें तुरंत WhatsApp पर
            बताएं।
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`https://wa.me/${COMPLAINT_NUMBER}?text=${COMPLAINT_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp पर शिकायत करें"
              className="hindi-text inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-colors duration-200 hover:bg-green-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300/60 active:bg-green-700"
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
              WhatsApp पर शिकायत करें
            </Link>
            <Link
              href="/contact"
              className="hindi-text inline-flex min-h-12 items-center justify-center rounded-xl border border-violet-400/40 px-5 py-3 font-semibold text-violet-300 transition-colors duration-200 hover:bg-violet-500/10 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            >
              पूरी जानकारी देखें
            </Link>
          </div>
        </section>

        {/* Footer Spacing */}
        <div className="py-8 flex justify-center">
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-violet-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SattaDashboard;
