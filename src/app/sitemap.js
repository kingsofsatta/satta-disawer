import { GAMES } from '@/utils/gameConfig';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sattadisawer.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/chart`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/payment-proofs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  // Dynamic game pages for current and previous years
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];
  
  const dynamicGamePages = GAMES.flatMap((game) =>
    years.map((year) => ({
      url: `${baseUrl}/${game.key}-${year}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }))
  );

  return [...staticPages, ...dynamicGamePages];
}
