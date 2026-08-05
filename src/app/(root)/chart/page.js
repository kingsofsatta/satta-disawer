import React from "react";
import ChartOne from "./ChartOne";

export const metadata = {
  title: "Satta Charts | Disawer, Gali, Faridabad Charts",
  description: "View comprehensive Satta Matka charts for all games. Yearly charts for Disawer, Gali, Faridabad, Delhi Bazar and more. Analyze patterns and trends.",
  keywords: [
    "satta chart",
    "disawer chart",
    "gali chart",
    "faridabad chart",
    "satta matka chart",
    "yearly chart",
    "satta king chart"
  ],
  openGraph: {
    title: "Satta Charts | Disawer, Gali, Faridabad Charts",
    description: "View comprehensive Satta Matka charts for all games. Analyze patterns and trends.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sattadisawer.com'}/chart`,
  },
};

const page = () => {
  return (
      <ChartOne />
  );
};

export default page;
