export const metadata = {
  title: "Payment Proofs | Verified Winners - Satta Disawer",
  description: "View authentic payment proofs from our winners. Real transaction screenshots showing successful payouts. Trust and transparency guaranteed.",
  keywords: [
    "satta payment proof",
    "satta winners",
    "payment verification",
    "satta payout proof",
    "winning proof"
  ],
  openGraph: {
    title: "Payment Proofs | Verified Winners - Satta Disawer",
    description: "View authentic payment proofs from our winners. Real transaction screenshots.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sattadisawer.com'}/payment-proofs`,
  },
};

export default function PaymentProofsLayout({ children }) {
  return children;
}
