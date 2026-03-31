"use client";
import React, { useState } from "react";
import T1Config from "@/components/T1Config";

const T1ConfigPage = () => {
  const [showConfig, setShowConfig] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">T1 Site Configuration</h1>
          <p className="text-gray-400">Manage configuration for the T1 site</p>
        </div>

        <T1Config
          showConfig={showConfig}
          setShowConfig={setShowConfig}
          onConfigSaved={() => {
            // Handle config saved
          }}
        />
      </div>
    </div>
  );
};

export default T1ConfigPage;