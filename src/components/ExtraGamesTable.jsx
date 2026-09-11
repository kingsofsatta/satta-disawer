"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { GAMES } from "@/utils/gameConfig";
import { isWaitingForResult } from "@/utils/gameTime";

const normalizeGameName = (name) => {
  const normalized = String(name || "").trim().toUpperCase().replace(/\s+/g, " ");
  if (["DESAWAR", "DISAWAR"].includes(normalized)) return "DISAWER";
  if (["GHAZIABAD", "GAZIABAD"].includes(normalized)) return "GAZIYABAD";
  return normalized;
};

const LOCAL_GAME_NAMES = new Set(GAMES.map((game) => normalizeGameName(game.name)));

export default function ExtraGamesTable({ games = [] }) {
  const [now, setNow] = useState(null);
  const extraGames = games.filter(
    (game) => !LOCAL_GAME_NAMES.has(normalizeGameName(game.name)),
  );

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    updateNow();
    const interval = setInterval(updateNow, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!extraGames.length) return null;

  return (
    <article className="mt-4 px-2 md:px-4" aria-label="Extra game results">
      <div className="relative overflow-x-auto rounded-2xl border border-slate-700 shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gradient-to-r from-violet-700 to-violet-600 text-sm sm:text-base">
            <tr>
              <th className="w-[37%] border border-violet-600 py-4 text-center font-bold text-white">Game</th>
              <th className="border border-violet-600 py-4 text-center font-bold text-violet-100">Yesterday</th>
              <th className="border border-violet-600 py-4 text-center font-bold text-violet-100">Today</th>
            </tr>
          </thead>
          <tbody>
            {extraGames.map((game) => (
              <tr key={game.id} className="border-b border-slate-700 bg-slate-800/50 transition-colors hover:bg-slate-700/50">
                <td className="border border-slate-700 bg-slate-800 px-3 py-3 text-center font-bold">
                  <p className="text-base font-bold text-amber-500 lg:text-lg">{game.name}</p>
                  <span className="text-sm font-medium text-slate-400">{game.time}</span>
                </td>
                <td className="border border-slate-700 bg-slate-800/50 p-3 text-center text-lg font-bold tracking-widest text-slate-300 lg:text-xl">{game.yesterday}</td>
                <td className="border border-slate-700 bg-slate-800/50 p-3 text-center">
                  {game.today === "--" ? (
                    <span className="flex justify-center" title={now && isWaitingForResult(game.time, now) ? "Waiting for result" : "Result pending"}>
                      <Clock3 className="size-9 text-violet-300" aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="text-xl font-black tracking-widest text-white lg:text-2xl">{game.today}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
