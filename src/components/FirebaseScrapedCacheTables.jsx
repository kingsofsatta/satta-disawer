import { GAMES } from "@/utils/gameConfig";

const normalizeGameName = (name) => {
  const normalized = String(name || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
  if (["DESAWAR", "DISAWAR"].includes(normalized)) return "DISAWER";
  if (["GHAZIABAD", "GAZIABAD"].includes(normalized)) return "GAZIYABAD";
  return normalized;
};

const LOCAL_GAME_NAMES = new Set(
  GAMES.map((game) => normalizeGameName(game.name)),
);

const FirebaseScrapedCacheTables = ({ data }) => {
  const games = (data?.homepageGames || []).filter(
    (game) => !LOCAL_GAME_NAMES.has(normalizeGameName(game.name)),
  );

  return (
    <>
      {games.length > 0 && (
        <article
          className="mt-4 px-2 md:px-4"
          aria-label="Firebase external results"
        >
          <div className="relative overflow-x-auto rounded-2xl border border-slate-700 shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gradient-to-r from-violet-700 to-violet-600 text-sm sm:text-base">
                <tr>
                  <th className="w-[37%] border border-violet-600 py-4 text-center font-bold text-white">
                    सट्टा का नाम
                  </th>
                  <th className="border border-violet-600 py-4 text-center font-bold text-violet-100">
                    कल आया था
                  </th>
                  <th className="border border-violet-600 py-4 text-center font-bold text-violet-100">
                    आज का रिज़ल्ट
                  </th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr
                    key={game.name}
                    className="border-b border-slate-700 bg-slate-800/50 transition-colors duration-200 hover:bg-slate-700/50"
                  >
                    <td className="border border-slate-700 bg-slate-800 px-3 py-3 text-center font-bold">
                      <p className="w-full text-base font-bold text-amber-500 lg:text-lg">
                        {game.name}
                      </p>
                      <span className="text-sm font-medium text-slate-400">
                        {game.time}
                      </span>
                    </td>
                    <td className="border border-slate-700 bg-slate-800/50 p-3 text-center">
                      <span className="text-lg font-bold tracking-widest text-slate-300 lg:text-xl">
                        {game.yesterday}
                      </span>
                    </td>
                    <td className="border border-slate-700 bg-slate-800/50 p-3 text-center">
                      <span className="text-lg font-black tracking-widest text-white lg:text-xl">
                        {game.today}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </>
  );
};

export default FirebaseScrapedCacheTables;
