"use client";

import React from "react";
import GoodluckConfig from "@/components/GoodluckConfig";

const GoodluckConfigPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-slate-900/85 p-6 shadow-xl border border-white/10">
          <GoodluckConfig />
        </div>
      </div>
    </div>
  );
};

export default GoodluckConfigPage;