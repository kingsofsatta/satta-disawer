import React from "react";
import Contact from "./Contact";

export const metadata = {
  title: "Contact Us | Satta Disawer Support",
  description: "Get in touch with Satta Disawer for support, queries, or partnership opportunities. We're here to help you 24/7.",
  keywords: ["satta contact", "satta support", "contact satta disawer"],
  openGraph: {
    title: "Contact Us | Satta Disawer Support",
    description: "Get in touch with Satta Disawer for support and queries.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sattadisawer.com'}/contact`,
  },
};

const page = () => {
  return (
    <div>
      <Contact />
    </div>
  );
};

export default page;
