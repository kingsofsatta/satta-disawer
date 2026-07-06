import React from "react";
import Image from "next/image";
import { GAMES, GAME_MAPPING } from "@/utils/gameConfig";

const SattaResultTable = ({ todayResults = [], yesterdayResults = [], externalGames = [] }) => {
  // Create games array from centralized config
  const sattaGames = GAMES.map((game, index) => {
    const todayResult = todayResults.find(
      (r) => r.game === game.key
    )?.resultNumber;
    const yesterdayResult = yesterdayResults.find(
      (r) => r.game === game.key
    )?.resultNumber;

    return {
      id: index + 1,
      displayName: game.name,
      time: game.time,
      yesterdayResult: yesterdayResult || "--",
      todayResult: todayResult,
      isLoading: !todayResult,
    };
  });

  // Component to render result cell content
  const ResultCell = ({ result, isLoading }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center">
          <Image
            alt="wait"
            width={40}
            height={40}
            src="/loading.gif"
            className="rounded-full"
            priority={false}
          />
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <span className="text-lg lg:text-xl font-black tracking-widest text-violet-400">
          {result}
        </span>
      </div>
    );
  };

  return (
    <article className="px-2 md:px-4 mt-4">
      <div className="relative overflow-x-auto rounded-2xl shadow-sm border border-slate-700">
        <table className="w-full text-sm text-left border-collapse">
          {/* Table Header */}
          <thead className="text-sm sm:text-base bg-gradient-to-r from-violet-700 to-violet-600">
            <tr>
              <th className="text-center text-white font-bold border border-violet-600 py-4 w-[37%]">
                🎮 सट्टा का नाम
              </th>
              <th className="py-4 text-center text-violet-100 font-bold border border-violet-600">
                ⏮️ कल आया था
              </th>
              <th className="py-4 text-center text-violet-100 font-bold border border-violet-600">
                🎯 आज का रिज़ल्ट
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {sattaGames.map((game, index) => (
              <tr key={game.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200 bg-slate-800/50">
                {/* Game Name Cell */}
                <td className="py-3 px-3 text-center font-bold border border-slate-700 bg-slate-800">
                  <p className="text-base text-amber-500 w-full lg:text-lg font-bold">
                    {game.displayName}
                  </p>
                  <span className="text-slate-400 text-sm font-medium">{game.time}</span>
                </td>
                {/* Yesterday Result Cell */}
                <td className="text-center bg-slate-800/50 border border-slate-700 p-3">
                  <div className="text-lg lg:text-xl font-bold tracking-widest text-slate-300">
                    {game.yesterdayResult}
                  </div>
                </td>
                {/* Today Result Cell */}
                <td className="text-center bg-slate-800/50 border border-slate-700 p-3">
                  <ResultCell
                    result={game.todayResult}
                    isLoading={game.isLoading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {externalGames.length > 0 && (
          <div className="mt-4 rounded-2xl bg-slate-900 p-4 border border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">External Games from Satta-King-Fast</h3>
                <p className="text-sm text-slate-400">These games are fetched from the external source and stored for up to two days.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-amber-300 text-sm font-semibold">
                {externalGames.length} games
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {externalGames.map((game, index) => (
                <div key={`${game.name}-${game.time}-${index}`} className="rounded-2xl bg-slate-800 p-4 border border-slate-700">
                  <p className="text-white font-semibold">{game.name}</p>
                  <p className="text-amber-300 text-sm mt-1">{game.time}</p>
                  <div className="mt-1 text-slate-300 text-sm space-y-0.5">
                    <p>Yesterday: <span className="text-white font-bold">{game.yesterdayResult ?? "--"}</span></p>
                    <p>Today: <span className="text-white font-bold">{game.todayResult ?? "--"}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default SattaResultTable;
