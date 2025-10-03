import { Product } from '@/types'

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Терминал сбора данных Zebra MC3300',
    slug: 'zebra-mc3300',
    shortDescription: 'Мобильный компьютер с Android, увеличенный экран 4 дюйма',
    description: 'Zebra MC3300 - это мощный мобильный компьютер с операционной системой Android, оснащенный 4-дюймовым экраном и современными технологиями связи. Идеально подходит для складских операций и розничной торговли.',
    sku: 'ZEB-MC3300-001',
    price: 65000,
    isNew: true,
    isFeatured: true,
    isAvailable: true,
    stock: 15,
    minOrder: 1,
    weight: 0.54,
    dimensions: {
      length: 222,
      width: 80,
      height: 49
    },
    images: ['/images/equipment/usb-cradle-connection.png'],
    category: {
      id: '1',
      name: 'Терминалы сбора данных',
      slug: 'tsd',
      sortOrder: 1,
      isActive: true
    },
    brand: {
      id: '1',
      name: 'Zebra',
      slug: 'zebra',
      logo: '/images/brands/Zebra_id1_bzK6E2_1.svg',
      isActive: true
    },
    specifications: [
      { id: '1', name: 'Операционная система', value: 'Android 10', group: 'Система', sortOrder: 1 },
      { id: '2', name: 'Процессор', value: 'Qualcomm Snapdragon 660', group: 'Система', sortOrder: 2 },
      { id: '3', name: 'Память', value: '4 ГБ RAM / 32 ГБ Flash', group: 'Система', sortOrder: 3 },
      { id: '4', name: 'Экран', value: '4.0" 800x480 WVGA', group: 'Дисплей', sortOrder: 4 },
      { id: '5', name: 'Сканер', value: '2D имиджер', group: 'Сканирование', sortOrder: 5 },
      { id: '6', name: 'Wi-Fi', value: '802.11 a/b/g/n/ac/ax', group: 'Связь', sortOrder: 6 },
      { id: '7', name: 'Bluetooth', value: '5.0', group: 'Связь', sortOrder: 7 },
      { id: '8', name: 'Защита', value: 'IP65', group: 'Защита', sortOrder: 8 }
    ],
    tags: [
      { id: '1', name: 'Android', slug: 'android', color: 'green' },
      { id: '2', name: '2D сканер', slug: '2d-scanner', color: 'blue' },
      { id: '3', name: 'Wi-Fi 6', slug: 'wifi-6', color: 'purple' }
    ],
    seoTitle: 'Zebra MC3300 купить в Москве - цена, характеристики',
    seoDescription: 'Терминал сбора данных Zebra MC3300 с Android 10 и 2D сканером. Официальная гарантия, доставка по России.',
    seoKeywords: ['zebra mc3300', 'терминал сбора данных', 'тсд android', 'мобильный компьютер'],
    viewCount: 245,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    name: 'Терминал сбора данных Honeywell EDA52',
    slug: 'honeywell-eda52',
    shortDescription: 'Компактный мобильный компьютер для розничной торговли',
    description: 'Honeywell EDA52 - компактный и легкий мобильный компьютер, специально разработанный для задач розничной торговли и небольших складов.',
    sku: 'HON-EDA52-001',
    price: 58000,
    isNew: true,
    isFeatured: false,
    isAvailable: true,
    stock: 8,
    minOrder: 1,
    images: ['/images/equipment/honeywell-eda52-500x500.png'],
    category: {
      id: '1',
      name: 'Терминалы сбора данных',
      slug: 'tsd',
      sortOrder: 1,
      isActive: true
    },
    brand: {
      id: '3',
      name: 'Honeywell',
      slug: 'honeywell',
      logo: '/images/brands/honeywell-logo.svg',
      isActive: true
    },
    specifications: [
      { id: '9', name: 'Операционная система', value: 'Android 11', group: 'Система', sortOrder: 1 },
      { id: '10', name: 'Экран', value: '5.0" HD 720x1280', group: 'Дисплей', sortOrder: 2 },
      { id: '11', name: 'Сканер', value: 'FlexRange 2D', group: 'Сканирование', sortOrder: 3 },
      { id: '12', name: 'Защита', value: 'IP65', group: 'Защита', sortOrder: 4 }
    ],
    tags: [
      { id: '1', name: 'Android', slug: 'android', color: 'green' },
      { id: '2', name: '2D сканер', slug: '2d-scanner', color: 'blue' }
    ],
    seoTitle: 'Honeywell EDA52 купить в Москве',
    seoDescription: 'Компактный терминал Honeywell EDA52 с Android 11. Идеален для розничной торговли.',
    seoKeywords: ['honeywell eda52', 'терминал розница', 'компактный тсд'],
    viewCount: 156,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z'
  },
  {
    id: '3',
    name: 'Принтер этикеток Zebra ZD420',
    slug: 'zebra-zd420',
    shortDescription: 'Настольный термопринтер с разрешением 203 dpi',
    description: 'Zebra ZD420 - надежный настольный термопринтер этикеток с простой настройкой и высоким качеством печати.',
    sku: 'ZEB-ZD420-001',
    price: 32000,
    isNew: false,
    isFeatured: true,
    isAvailable: true,
    stock: 25,
    minOrder: 1,
    images: ['/images/equipment/zd420d-product-photography-left-350.jpg'],
    category: {
      id: '3',
      name: 'Принтеры этикеток',
      slug: 'printers',
      sortOrder: 3,
      isActive: true
    },
    brand: {
      id: '1',
      name: 'Zebra',
      slug: 'zebra',
      logo: '/images/brands/Zebra_id1_bzK6E2_1.svg',
      isActive: true
    },
    specifications: [
      { id: '13', name: 'Тип печати', value: 'Термопечать', group: 'Печать', sortOrder: 1 },
      { id: '14', name: 'Разрешение', value: '203 dpi', group: 'Печать', sortOrder: 2 },
      { id: '15', name: 'Ширина печати', value: 'До 104 мм', group: 'Печать', sortOrder: 3 },
      { id: '16', name: 'Интерфейсы', value: 'USB, Ethernet', group: 'Подключение', sortOrder: 4 }
    ],
    tags: [
      { id: '4', name: 'Термопечать', slug: 'thermal', color: 'orange' },
      { id: '5', name: 'Настольный', slug: 'desktop', color: 'gray' }
    ],
    seoTitle: 'Zebra ZD420 принтер этикеток купить',
    seoDescription: 'Настольный термопринтер Zebra ZD420 203 dpi. Простая настройка, высокое качество печати.',
    seoKeywords: ['zebra zd420', 'принтер этикеток', 'термопринтер', 'настольный принтер'],
    viewCount: 189,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  },
  {
    id: '4',
    name: 'Сканер штрих-кода Datalogic QuickScan QD2131',
    slug: 'datalogic-quickscan-qd2131',
    shortDescription: 'Ручной лазерный сканер для розничной торговли',
    description: 'Datalogic QuickScan QD2131 - надежный ручной лазерный сканер с эргономичным дизайном для комфортной работы.',
    sku: 'DTL-QD2131-001',
    price: 8500,
    isNew: false,
    isFeatured: false,
    isAvailable: true,
    stock: 45,
    minOrder: 1,
    images: ['/images/equipment/QS2500Series.png'],
    category: {
      id: '2',
      name: 'Сканеры штрих-кода',
      slug: 'scanners',
      sortOrder: 2,
      isActive: true
    },
    brand: {
      id: '2',
      name: 'Datalogic',
      slug: 'datalogic',
      logo: '/images/brands/datalogic.svg',
      isActive: true
    },
    specifications: [
      { id: '17', name: 'Тип сканера', value: 'Лазерный 1D', group: 'Сканирование', sortOrder: 1 },
      { id: '18', name: 'Интерфейс', value: 'USB', group: 'Подключение', sortOrder: 2 },
      { id: '19', name: 'Дальность', value: 'До 35 см', group: 'Сканирование', sortOrder: 3 }
    ],
    tags: [
      { id: '6', name: '1D сканер', slug: '1d-scanner', color: 'blue' },
      { id: '7', name: 'Лазерный', slug: 'laser', color: 'red' }
    ],
    seoTitle: 'Datalogic QuickScan QD2131 сканер купить',
    seoDescription: 'Ручной лазерный сканер Datalogic QuickScan QD2131. Эргономичный дизайн, надежность.',
    seoKeywords: ['datalogic quickscan', 'лазерный сканер', '1d сканер', 'ручной сканер'],
    viewCount: 98,
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-10T10:30:00Z'
  }
]
