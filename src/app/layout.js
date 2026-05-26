import "./globals.css";
import { Poppins, Noto_Sans_Devanagari } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400','500','600','700','800','900'],
  display: 'swap'
})

const noto = Noto_Sans_Devanagari({
  subsets: ['devanagari','latin'],
  weight: ['400','500','600','700'],
  display: 'swap'
})

const baseUrl = process.env.SITE_URL || 'https://example.com'

export const metadata = {
  title: "Satta Disawer",
  description: "Satta Disawer - Satta Matka Results, Charts, and More",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: { width: "device-width", initialScale: 1 },
  openGraph: {
    title: 'Satta Disawer',
    description: 'Satta Disawer - Satta Matka Results, Charts, and More',
    url: baseUrl,
    siteName: 'Satta Disawer',
    images: [
      {
        url: `${baseUrl}/favicon.ico`,
        width: 512,
        height: 512,
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image'
  }
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
    <html lang="en" className={`${poppins.className} ${noto.className}`}>
      <body className={`antialiased`}> 
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
