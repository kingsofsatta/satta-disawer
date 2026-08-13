import React from "react";
import Image from "next/image";
import { GAMES } from "@/utils/gameConfig";
import {
  canUseDisawerTodayResult,
  isSnapshotFromCurrentISTDate,
} from "@/utils/externalResultGuard";

const EXTERNAL_NAME_BY_LOCAL_KEY = {
  disawer: "DISAWER",
  "delhi-bazar": "DELHI BAZAR",
  "shri-ganesh": "SHRI GANESH",
  faridabad: "FARIDABAD",
  gaziyabad: "GHAZIABAD",
  gali: "GALI",
};

const SattaResultTable = ({
  todayResults = [],
  yesterdayResults = [],
  externalGames = [],
}) => {
  // Create games array from centralized config
  const sattaGames = GAMES.map((game, index) => {
    const externalName = EXTERNAL_NAME_BY_LOCAL_KEY[game.key];
    const externalGame = externalName
      ? externalGames.find((item) => item.name === externalName)
      : null;
    const localTodayResult = todayResults.find(
      (r) => r.game === game.key,
    )?.resultNumber;
    const localYesterdayResult = yesterdayResults.find(
      (r) => r.game === game.key,
    )?.resultNumber;
    const disawerIsWaiting =
      game.key === "disawer" && !canUseDisawerTodayResult();
    const externalTodayResultIsCurrent =
      game.key !== "disawer" ||
      isSnapshotFromCurrentISTDate(externalGame?.fetchedAt);
    const externalTodayResult = externalTodayResultIsCurrent
      ? externalGame?.todayResult
      : null;
    const todayResult = disawerIsWaiting
      ? null
      : externalTodayResult || localTodayResult;
    const yesterdayResult =
      externalGame?.yesterdayResult || localYesterdayResult;

    return {
      id: `local-${index}`,
      displayName: game.name,
      time: externalGame?.time || game.time,
      yesterdayResult: yesterdayResult || "--",
      todayResult: todayResult || "--",
      isLoading: !todayResult,
      isExternal: Boolean(externalGame),
    };
  });

  const tableRows = sattaGames;

  const ResultCell = ({ result, isLoading }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center">
          {/* <Image
            alt="wait"
            width={40}
            height={40}
            src="/loading.gif"
            className="rounded-full"
            priority={false}
          /> */}
          <span className="text-lg lg:text-xl font-black tracking-widest text-white">
           --
          </span>
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <span className="text-lg lg:text-xl font-black tracking-widest text-white">
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
            {tableRows.map((game) => (
              <tr
                key={game.id}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-200 bg-slate-800/50"
              >
                {/* Game Name Cell */}
                <td className="py-3 px-3 text-center font-bold border border-slate-700 bg-slate-800">
                  <p className="text-base text-amber-500 w-full lg:text-lg font-bold">
                    {game.displayName}
                  </p>
                  <span className="text-slate-400 text-sm font-medium">
                    {game.time}
                  </span>
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
      </div>
    </article>
  );
};

export default SattaResultTable;
