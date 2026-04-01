"use client";
import React, { useState } from "react";

import T1Config from "@/components/T1Config";
import AdminNavbar from "@/components/common/AdminNavbar";

const T1ConfigPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <AdminNavbar title="T1 Configuration" subtitle="Manage T1 site settings" backHref="/admin" />
      <T1Config />
    </div>
  );
};

export default T1ConfigPage;