import React from "react";
import Image from "next/image";
import { GAMES, GAME_MAPPING } from "@/utils/gameConfig";

const SattaResultTable = ({ todayResults = [], yesterdayResults = [], externalGames = [] }) => {
  // Create games array from centralized config
  const sattaGames = GAMES.map((game, index) => {
    const todayResult = todayResults.find((r) => r.game === game.key)?.resultNumber;
    const yesterdayResult = yesterdayResults.find((r) => r.game === game.key)?.resultNumber;

    return {
      id: `local-${index}`,
      displayName: game.name,
      time: game.time,
      yesterdayResult: yesterdayResult || "--",
      todayResult: todayResult || "--",
      isLoading: !todayResult,
      isExternal: false,
    };
  });

  const externalRows = externalGames.map((game, index) => ({
    id: `external-${index}`,
    displayName: game.name,
    time: game.time,
    yesterdayResult: game.yesterdayResult || "--",
    todayResult: game.todayResult || "--",
    isLoading: false,
    isExternal: true,
  }));

  const tableRows = [...sattaGames, ...externalRows];

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
        <span className="text-lg lg:text-xl font-black tracking-widest text-red-600">
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
          <thead className="text-sm sm:text-base bg-gradient-to-r from-amber-300 via-red-300 to-amber-300">
            <tr>
              <th className="text-center text-slate-900 font-bold border border-red-200 py-4 w-[37%]">
                🎮 सट्टा का नाम
              </th>
              <th className="py-4 text-center text-slate-900 font-bold border border-red-200">
                ⏮️ कल आया था
              </th>
              <th className="py-4 text-center text-slate-900 font-bold border border-red-200">
                🎯 आज का रिज़ल्ट
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {tableRows.map((game) => (
              <tr
                key={game.id}
                className={`border-b transition-colors duration-200 ${game.isExternal ? "bg-red-50 hover:bg-red-100" : "bg-white/90 hover:bg-yellow-50"}`}
              >
                {/* Game Name Cell */}
                <td className={`py-1 px-3 text-center font-bold border ${game.isExternal ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}`}>
                  <p className={`text-base w-full lg:text-lg font-bold text-black`}>
                    {game.displayName}
                  </p>
                  <span className="text-slate-500 text-sm font-medium">{game.time}</span>
                </td>
                {/* Yesterday Result Cell */}
                <td className={`text-center border p-3 ${game.isExternal ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}`}>
                  <div className="text-lg lg:text-xl font-bold tracking-widest text-slate-800">
                    {game.yesterdayResult}
                  </div>
                </td>
                {/* Today Result Cell */}
                <td className={`text-center border p-3 ${game.isExternal ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}`}>
                  <ResultCell result={game.todayResult} isLoading={game.isLoading} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default SattaResultTable;
