"use client";
import Image from "next/image";
import Link from "next/link";
import DateTime from "./DateTime";

// Default schedule fallback
const defaultSchedule = [
  { name: "SHIRDI DHAM", time: "12:55 PM" },
  { name: "KALIYAR", time: "01:55 PM" },
  { name: "DELHI BAZAR", time: "03:00 PM" },
  { name: "SHRI GANESH", time: "04:30 PM" },
  { name: "FARIDABAD", time: "05:45 PM" },
  { name: "SHAKTI PEETH", time: "07:25 PM" },
  { name: "GAZIYABAD", time: "09:00 PM" },
  { name: "MATHURA", time: "10:00 PM" },
  { name: "GALI", time: "11:30 PM" },
  { name: "DISAWAR", time: "04:50 AM" },
];

// Khaiwal Card Component
const KhaiwalCard = ({ section, colorScheme = "violet" }) => {
  const schedule = section?.gameSchedule?.length > 0
    ? section.gameSchedule
    : defaultSchedule;

  const contactName = section?.contactName || "KHAIWAL";
  const whatsappNumber = section?.whatsappNumber || "";
  const telegramNumber = section?.telegramNumber || "123456789";
  const rate = section?.rate || "";

  const gradientClass = colorScheme === "violet"
    ? "from-violet-600 to-violet-500"
    : "from-amber-600 to-amber-500";

  return (
    <div className="glass-dark rounded-2xl p-6 border-animate shadow-2xl h-full">
      <p className="text-lg lg:text-xl text-center text-amber-100 mb-3 font-bold hindi-text">
        -- सीधे सट्टा कंपनी का No. 1 खाईवाल --
      </p>
      <p className="uppercase text-center mb-5 text-xl lg:text-2xl text-white font-black">
        {contactName}
      </p>

      <div className="space-y-1 mb-6 bg-white/10 rounded-xl p-4">
        {schedule.map((game, index) => (
          <div
            key={index}
            className="flex justify-between text-sm items-center py-2 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 rounded transition-colors"
          >
            <span className="text-violet-100 font-semibold">
              {game.name}
            </span>
            <span className="text-amber-300 font-bold">
              {game.time}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center my-5 py-4 bg-white/10 rounded-xl">
        <p className="text-amber-300 font-bold mb-2 text-lg hindi-text">जोड़ी रेट</p>
        <p className="text-violet-100 text-sm md:text-lg font-bold hindi-text">जोड़ी रेट 10 ------- {rate}</p>
        <p className="text-violet-100 text-sm md:text-lg font-bold hindi-text">हरूफ रेट 100 ----- {rate}</p>
      </div>

      <p className="text-center text-violet-100 text-lg lg:text-xl mb-5 hindi-text">
        Game play करने के लिये नीचे लिंक पर क्लिक करे
      </p>

      <div className="flex flex-col gap-3 text-center">
        <Link
          target="_blank"
          href={`https://wa.me/+91${whatsappNumber}`}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 btn-glow"
        >
          <span>  <Image
            width={24}
            height={24}
            src="https://i.ibb.co/x8fsyXVj/Whats-App-svg.webp"
            alt="whatsapp"
          /></span>
          <span className="hindi-text">WhatsApp पर संपर्क करें</span>
        </Link>

        <p className="text-center text-violet-100 text-base mb-1 mt-2 hindi-text">
          Join our Telegram channel to get results quickly and receive superfast results
        </p>
        {telegramNumber && (
          <Link
            target="_blank"
            href={`https://t.me/${telegramNumber}`}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 btn-glow"
          >
            <span><Image src='/telegram-icon.webp' height={24} width={24} /></span>
            <span className="hindi-text">Telegram पर संपर्क करें</span>
          </Link>
        )}
      </div>
    </div>
  );
};

const GamePage = ({ data, setting, disawarData }) => {
  const currentYear = new Date().getFullYear();

  // Get khaiwal sections from settings
  const khaiwalSection1 = setting?.khaiwalSection1 || {
    enabled: true,
    contactName: setting?.contactName || "TEJU BHAI KHAIWAL",
    whatsappNumber: setting?.whatsappNumber || "",
    rate: setting?.rate || "",
    gameSchedule: defaultSchedule
  };

  const khaiwalSection2 = setting?.khaiwalSection2 || {
    enabled: false,
    contactName: "",
    whatsappNumber: "",
    rate: "",
    gameSchedule: defaultSchedule
  };

  // Check if second section is enabled
  const showSecondSection = khaiwalSection2?.enabled && khaiwalSection2?.contactName;

  return (
    <div className="bg-transparent">
      {/* === TOP DYNAMIC SECTION === */}
      <div className="glass-card mx-2 md:mx-4 mt-4 rounded-2xl pt-5 pb-6 shadow-sm">
        <div className="text-center">
          <DateTime />
        </div>
        <hr className="border-slate-700 w-11/12 mx-auto my-5" />

        <div className="flex uppercase mx-auto text-center w-full font-semibold flex-col gap-4 items-center justify-center">
          {data && (
            <>
              <p className="text-amber-500 text-2xl sm:text-3xl font-bold">
                {data.game.replace("_", " ")}
              </p>
              <p className="text-violet-400 text-3xl md:text-4xl font-black">
                {data.resultNumber}
              </p>

              <div className="h-px w-32 bg-gradient-to-r from-transparent via-violet-400 to-transparent my-2"></div>

              <p className="text-amber-500 text-2xl sm:text-[28px] font-bold">
                {data.waitingGame.replace("_", " ")}
              </p>
              <Image
                className="mx-auto rounded-full"
                alt="wait icon"
                width={45}
                height={45}
                src="/loading.gif"
              />
            </>
          )}
        </div>
      </div>

      {/* DISAWAR Section */}
      <div className="mx-2 md:mx-4 mt-4 rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-900 via-slate-900 to-violet-900 py-3 px-4 border-b border-violet-500/30">
          <Link
            href={`/disawer-yearly-chart-${currentYear}`}
            className="flex items-center justify-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 bg-clip-text text-transparent group-hover:from-amber-400 group-hover:via-yellow-400 group-hover:to-amber-400 transition-all">
              DISAWAR
            </span>
            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
          </Link>
        </div>

        {/* Results Row */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 py-4 px-4">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {/* Yesterday Result */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Yesterday</span>
              <span className="text-xl sm:text-2xl font-black text-white bg-violet-600/30 border border-violet-500/50 px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/20">
                {disawarData?.yesterday || "--"}
              </span>
            </div>

            {/* Arrow */}
            <span className="text-3xl text-amber-400">➜</span>

            {/* Today Result */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Today</span>
              <span className="text-xl sm:text-2xl font-black text-white bg-amber-600/30 border border-amber-500/50 px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                {disawarData?.today || (
                  <Image
                    className="inline rounded-full"
                    alt="wait icon"
                    width={28}
                    height={28}
                    src="/loading.gif"
                  />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 py-4 px-4 mt-5">
        <p className="text-sm md:text-base text-center text-slate-300 leading-relaxed">
          You are welcome to goodlucksatta-mongodb.vercel.app, the most popular site on Satta Matka. Loyalty program, instant games, all-free Kalyan, Milan, Rajdhani, Ratan, and Main Bazar games. We are a global DP Boss and the top-ranking. Competition: Matka results See fast Matka results in the Matka chart. It is the leading Matka site where DpBoss guessed. Take the last ank and individual open predictions each day.
        </p>
        <p className="text-lg md:text-xl font-bold italic text-amber-400 text-center mt-3">
          The current Dpboss Kalyan Satta Matka Results.
        </p>
      </div>
      {/* === BOTTOM KHAIWAL SECTIONS === */}
      <section className="py-8 px-2 md:px-4">
        <div className={`max-w-6xl mx-auto ${showSecondSection ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'max-w-md'}`}>
          {/* Khaiwal Section 1 - Always shown */}
          <KhaiwalCard section={khaiwalSection1} colorScheme="violet" />

          {/* Khaiwal Section 2 - Only shown if enabled */}
          {showSecondSection && (
            <KhaiwalCard section={khaiwalSection2} colorScheme="amber" />
          )}
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="mx-2 md:mx-4 mt-4 bg-slate-800 rounded-lg py-3 px-4 overflow-hidden">
        <p className="text-xs md:text-sm text-center text-violet-300 font-semibold leading-relaxed uppercase">
          SATTA MATKA SATTA FAST RESULT KALYAN TOP MATKA RESULT KALYAN FAST RESULT MILAN RATAN RAJDHANI MAIN BAZAR MATKA FAST TIPS RESULT MATKA CHART JODI CHART PANEL CHART FIX GAME SATTAMATKA ! MATKA MOBI SATTA 143 DPBOSS.NET TOP NO1 RESULT FULL RATE MATKA ONLINE GAME PLAY BY APP DPBOSS
        </p>
      </div>
    </div>
  );
};

export default GamePage;
