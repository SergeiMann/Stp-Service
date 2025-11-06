import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css'
import { SITE_CONFIG } from '@/lib/constants'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { ConditionalHeader } from '@/components/layout/ConditionalHeader'
import { BackToTop } from '@/components/ui/BackToTop'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  icons: {
    icon: [
      { url: '/images/brands/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/brands/logo.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/images/brands/logo.png',
  },
  keywords: [
    'ремонт оборудования',
    'ремонт ТСД', 
    'сканеры штрих-кода',
    'принтеры этикеток',
    'термопринтеры',
    'zebra',
    'datalogic',
    'honeywell',
    'сервисный центр'
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        {/* Локальное подключение Font Awesome через импорт выше */}
        <link rel="icon" href="/images/brands/logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/images/brands/logo.png" type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/images/brands/logo.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <ConditionalHeader />
              <main>{children}</main>
              <BackToTop />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}