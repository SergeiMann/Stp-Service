import Head from 'next/head'
import { SITE_CONFIG } from '@/lib/constants'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
}

export function SEOHead({
  title,
  description = SITE_CONFIG.description,
  keywords = [],
  image,
  url,
  type = 'website',
  noindex = false
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name
  const fullUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url
  const ogImage = image || `${SITE_CONFIG.url}/images/og-image.jpg`
  
  const allKeywords = [
    ...keywords,
    'ремонт торгового оборудования',
    'ремонт ТСД',
    'сканеры штрих-кода',
    'принтеры этикеток',
    'zebra',
    'datalogic',
    'honeywell',
    'сервисный центр'
  ].join(', ')

  return (
    <Head>
      {/* Основные метатеги */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Дополнительные метатеги */}
      <meta name="author" content={SITE_CONFIG.name} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Russian" />
      
      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": SITE_CONFIG.name,
            "description": SITE_CONFIG.description,
            "url": SITE_CONFIG.url,
            "logo": `${SITE_CONFIG.url}/images/brands/logo.svg`,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": SITE_CONFIG.phone,
              "contactType": "customer service",
              "areaServed": "RU",
              "availableLanguage": "Russian"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "RU",
              "addressLocality": "Москва"
            },
            "sameAs": [
              // Добавить ссылки на соцсети если есть
            ]
          })
        }}
      />
    </Head>
  )
}
