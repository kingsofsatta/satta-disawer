"use client";
import React, { useState } from "react";

import T1Config from "@/components/T1Config";

const T1ConfigPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-slate-900/85 p-6 shadow-xl border border-white/10">
          <T1Config />
        </div>
      </div>
    </div>
  );
};

export default T1ConfigPage;