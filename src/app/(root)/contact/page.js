import React from "react";
import Contact from "./Contact";

export const metadata = {
  title: "शिकायत | Satta Disawer सहायता",
  description: "भुगतान या किसी अन्य समस्या के लिए WhatsApp पर अपनी शिकायत दर्ज करें।",
  keywords: ["सट्टा शिकायत", "भुगतान शिकायत", "satta complaint"],
  openGraph: {
    title: "शिकायत | Satta Disawer सहायता",
    description: "भुगतान या किसी अन्य समस्या के लिए WhatsApp पर शिकायत दर्ज करें।",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sattadisawer.com'}/contact`,
  },
};

const ComplaintPage = () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default ComplaintPage;
