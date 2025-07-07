/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  },
  images: {
    domains: ['images.pexels.com', 'pexels.com'],
  },
}

module.exports = nextConfig