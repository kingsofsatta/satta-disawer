"use client";

import React from "react";
import GoodluckConfig from "@/components/GoodluckConfig";
import AdminNavbar from "@/components/common/AdminNavbar";

const GoodluckConfigPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <AdminNavbar title="Good Luck Configuration" subtitle="Manage Good Luck site settings" backHref="/admin" />
      <div className="max-w-2xl mx-auto p-4">
        <GoodluckConfig />
      </div>
    </div>
  );
};

export default GoodluckConfigPage;