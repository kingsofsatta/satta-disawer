import "./globals.css";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

const baseUrl = process.env.SITE_URL || 'https://www.sattadisawer.com/'

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": baseUrl,
    "name": "Satta Disawer",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/?s={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <html lang="en" className={poppins.className}>
      <head>
        {/* Preconnect to critical origins to reduce connection latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://securepubads.g.doubleclick.net" />
        <link rel="preconnect" href="https://i.ibb.co" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800;900&display=swap" />
        <meta name="google-site-verification" content="cWjJpNxBiG9deZ8gPBtHKf_287SB0gI7lcuDAVb-zfE" />
        {/* DNS prefetch for external origins */}
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      </head>
      <body className={`antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
