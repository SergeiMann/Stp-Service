import { Brand } from '@/types'

export const popularBrands: Omit<Brand, 'productsCount'>[] = [
  {
    id: '1',
    name: 'Zebra',
    slug: 'zebra',
    logo: '/images/brands/Zebra_id1_bzK6E2_1.svg',
    description: 'Ведущий производитель ТСД и принтеров этикеток',
    website: 'https://www.zebra.com',
    isActive: true
  },
  {
    id: '2',
    name: 'Datalogic',
    slug: 'datalogic',
    logo: '/images/brands/datalogic.svg',
    description: 'Итальянский производитель систем автоматической идентификации',
    website: 'https://www.datalogic.com',
    isActive: true
  },
  {
    id: '3',
    name: 'Honeywell',
    slug: 'honeywell',
    logo: '/images/brands/honeywell-logo.svg',
    description: 'Американская корпорация, производитель промышленного оборудования',
    website: 'https://www.honeywell.com',
    isActive: true
  },
  {
    id: '4',
    name: 'M3 Mobile',
    slug: 'm3-mobile',
    logo: '/images/brands/m3mobile.svg',
    description: 'Корейский производитель мобильных компьютеров',
    website: 'https://www.m3mobile.co.kr',
    isActive: true
  },
  {
    id: '5',
    name: 'Urovo',
    slug: 'urovo',
    logo: '/images/brands/urovo.svg',
    description: 'Китайский производитель мобильных терминалов',
    website: 'https://www.urovo.com',
    isActive: true
  },
  {
    id: '6',
    name: 'Bixolon',
    slug: 'bixolon',
    logo: '/images/brands/bixolon_logo.svg',
    description: 'Корейский производитель принтеров этикеток',
    website: 'https://www.bixolon.com',
    isActive: true
  },
  {
    id: '7',
    name: 'TSC',
    slug: 'tsc',
    logo: '/images/brands/tsc.svg',
    description: 'Тайваньский производитель принтеров штрих-кодов',
    website: 'https://www.tscprinters.com',
    isActive: true
  },
  {
    id: '8',
    name: 'Godex',
    slug: 'godex',
    logo: '/images/brands/godex.svg',
    description: 'Тайваньский производитель принтеров этикеток',
    website: 'https://www.godexintl.com',
    isActive: true
  }
]
