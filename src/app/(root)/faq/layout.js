import SimpleFAQ from "@/components/SimpleFAQ";

export const metadata = {
  title: "FAQ | Frequently Asked Questions - Satta Disawer",
  description: "Get answers to frequently asked questions about Satta Disawer, Satta Matka games, results, charts, and how to play. Learn everything you need to know.",
  keywords: [
    "satta faq",
    "satta questions",
    "how to play satta",
    "satta matka faq",
    "satta help"
  ],
  openGraph: {
    title: "FAQ | Frequently Asked Questions - Satta Disawer",
    description: "Get answers to frequently asked questions about Satta Disawer and Satta Matka games.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sattadisawer.com'}/faq`,
  },
};

export default function FAQLayout({ children }) {
  return children;
}
