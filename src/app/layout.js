import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sattadisawer.com'),
  title: {
    default: "Satta Disawer | Live Results, Charts & Predictions",
    template: "%s | Satta Disawer"
  },
  description: "Get fast and accurate Satta Disawer results, charts, and predictions. Live updates for Disawer, Gali, Faridabad, and all Satta Matka games. Check today's results now!",
  keywords: [
    "satta disawer",
    "satta matka",
    "disawer result",
    "gali result",
    "faridabad satta",
    "satta king",
    "satta chart",
    "satta result",
    "matka result",
    "delhi bazar result",
    "live satta result"
  ],
  authors: [{ name: "Satta Disawer" }],
  creator: "Satta Disawer",
  publisher: "Satta Disawer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
  viewport: { 
    width: "device-width", 
    initialScale: 1,
    maximumScale: 5
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Satta Disawer',
    title: 'Satta Disawer | Live Results, Charts & Predictions',
    description: 'Get fast and accurate Satta Disawer results, charts, and predictions. Live updates for all Satta Matka games.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satta Disawer | Live Results & Charts',
    description: 'Get fast and accurate Satta Disawer results, charts, and predictions.',
  },
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sattadisawer.com',
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
