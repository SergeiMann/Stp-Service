/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep development assets separate from production builds run during checks.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactStrictMode: true,
  async redirects() {
    // Отдельной страницы услуг больше нет: услуги и цены — в разделе на главной
    const services = { source: '/services', destination: '/#services', permanent: true }
    return [services, ...[
      'tsd',
      'scanners',
      '3d-scan',
      'printers',
      'wifi',
      'refurbished',
    ].map(section => ({
      source: `/catalog/${section}`,
      destination: `/catalog?category=${section}`,
      permanent: true,
    }))]
  },
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
