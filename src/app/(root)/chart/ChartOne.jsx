"use client";
import React from "react";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";
import { GAMES } from "@/utils/gameConfig";

const ChartSattaTable = () => {
  // Dynamically calculate current and previous year
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const sattaLinks = GAMES.map((game) => ({
    id: game.order,
    href: `${game.key.replace("_", "-")}-yearly-chart-${currentYear}`,
    href2: `${game.key.replace("_", "-")}-yearly-chart-${previousYear}`,
    currentYear: `${currentYear}`,
    lastYear: `${previousYear}`,
    name: `${game.name}`
  }));

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-4 pb-8 mt-4">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-violet-700 to-violet-600 rounded-xl p-6 mb-8 text-center">
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

      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-violet-400">
          📊 Yearly Charts
        </h1>
        <p className="text-slate-400 mt-2">Select game to view yearly record</p>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-700">
        <table className="w-full text-center">
          <thead>
            <tr className="bg-gradient-to-r from-violet-700 to-violet-600">
              <th className="px-4 py-4 text-white font-bold text-sm uppercase tracking-wider">
                🎮 Games
              </th>
              <th className="px-4 py-4 text-white font-bold text-sm uppercase tracking-wider">
                {currentYear}
              </th>
              <th className="px-4 py-4 text-white font-bold text-sm uppercase tracking-wider">
                {previousYear}
              </th>
            </tr>
          </thead>
          <tbody>
            {sattaLinks.map((link, index) => (
              <tr
                key={index}
                className="hover:bg-slate-700/50 transition-all duration-300 border-b border-slate-700"
              >
                <td className="px-4 py-4">
                  <span className="text-slate-300 font-semibold text-base">
                    {link.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={link.href}>
                    <span className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105">
                      View
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={link.href2}>
                    <span className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105">
                      View
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Decorative Element */}
      <div className="mt-8 flex justify-center">
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default ChartSattaTable;
