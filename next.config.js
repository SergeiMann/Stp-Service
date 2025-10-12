/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    // Ускоряем прод-сборку: ESLint не запускается во время build
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cdn.sanity.io', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig
