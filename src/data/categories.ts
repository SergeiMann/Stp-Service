export const productCategories = [
  {
    id: '1',
    name: 'Терминалы сбора данных',
    slug: 'tsd',
    description: 'Мобильные компьютеры для сбора и обработки данных',
    image: '/images/categories/tsd.jpg',
    sortOrder: 1,
    isActive: true,
    children: [
      { 
        id: '11',
        name: 'Новые ТСД', 
        slug: 'tsd-new', 
        description: 'Новые терминалы от производителя',
        sortOrder: 1,
        isActive: true
      },
      { 
        id: '12',
        name: 'Восстановленные ТСД', 
        slug: 'tsd-used', 
        description: 'Восстановленные терминалы с гарантией',
        sortOrder: 2,
        isActive: true
      },
      { 
        id: '13',
        name: 'Промышленные ТСД', 
        slug: 'tsd-industrial', 
        description: 'Защищенные терминалы для промышленности',
        sortOrder: 3,
        isActive: true
      },
    ]
  },
  {
    id: '2',
    name: 'Сканеры штрих-кода',
    slug: 'scanners',
    description: 'Устройства для считывания штрих-кодов',
    image: '/images/categories/scanners.jpg',
    sortOrder: 2,
    isActive: true,
    children: [
      { 
        id: '21',
        name: 'Ручные сканеры', 
        slug: 'scanners-handheld', 
        description: 'Портативные сканеры штрих-кода',
        sortOrder: 1,
        isActive: true
      },
      { 
        id: '22',
        name: 'Стационарные сканеры', 
        slug: 'scanners-stationary', 
        description: 'Встраиваемые и настольные сканеры',
        sortOrder: 2,
        isActive: true
      },
      { 
        id: '23',
        name: 'Беспроводные сканеры', 
        slug: 'scanners-wireless', 
        description: 'Сканеры с беспроводным подключением',
        sortOrder: 3,
        isActive: true
      },
    ]
  },
  {
    id: '3',
    name: 'Принтеры этикеток',
    slug: 'printers',
    description: 'Принтеры для печати этикеток и бирок',
    image: '/images/categories/printers.jpg',
    sortOrder: 3,
    isActive: true,
    children: [
      { 
        id: '31',
        name: 'Настольные принтеры', 
        slug: 'printers-desktop', 
        description: 'Компактные принтеры для офиса',
        sortOrder: 1,
        isActive: true
      },
      { 
        id: '32',
        name: 'Промышленные принтеры', 
        slug: 'printers-industrial', 
        description: 'Мощные принтеры для производства',
        sortOrder: 2,
        isActive: true
      },
    ]
  },
  {
    id: '4',
    name: 'Программное обеспечение',
    slug: 'software',
    description: 'ПО для терминалов и автоматизации',
    image: '/images/categories/software.jpg',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: '5',
    name: 'Запчасти и аксессуары',
    slug: 'parts',
    description: 'Комплектующие и аксессуары',
    image: '/images/categories/parts.jpg',
    sortOrder: 5,
    isActive: true,
    children: [
      { 
        id: '51',
        name: 'Батареи', 
        slug: 'parts-batteries', 
        description: 'Аккумуляторы для ТСД',
        sortOrder: 1,
        isActive: true
      },
      { 
        id: '52',
        name: 'Зарядные устройства', 
        slug: 'parts-chargers', 
        description: 'Док-станции и зарядники',
        sortOrder: 2,
        isActive: true
      },
      { 
        id: '53',
        name: 'Чехлы и кобуры', 
        slug: 'parts-cases', 
        description: 'Защитные чехлы',
        sortOrder: 3,
        isActive: true
      },
    ]
  }
]