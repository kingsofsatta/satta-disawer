/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.ibb.co", 'cdn.prod.website-files.com', 'goodlucksatta.in'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'goodlucksatta.in',
        pathname: '/**'
      }
    ],
  },
};

export default nextConfig;
