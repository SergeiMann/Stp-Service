// Public catalog shortcuts span manufacturer-specific categories from ThinkLink.
// Keep explicit category roots: broad text matching also selects POS terminals,
// document scanners, card printers and surveying equipment.
export const equipmentSections = [
  {
    slug: 'tsd',
    name: 'Терминалы сбора данных',
    roots: [
      'tsd',
      'thinklink--1333',
      'thinklink--1348',
      'thinklink--1403',
      'thinklink--1536',
      'thinklink--1649',
      'thinklink--2-1766',
      'thinklink--2-1806',
      'thinklink--1934',
      'thinklink--1935',
      'thinklink--2-2047',
      'thinklink--2100',
      'thinklink--2174',
    ],
  },
  {
    slug: 'scanners',
    name: 'Сканеры штрих-кода',
    roots: [
      'scanners',
      'thinklink--1335',
      'thinklink--1349',
      'thinklink--1501',
      'thinklink--1402',
      'thinklink--1893',
      'thinklink--1913',
      'thinklink--1917',
      'thinklink--1483',
      'thinklink--1648',
      'thinklink--1765',
      'thinklink--2-1801',
      'thinklink--2-1823',
      'thinklink--2-1820',
      'thinklink--1821',
      'thinklink--2-1859',
      'thinklink--2-1860',
      'thinklink--2-1861',
      'thinklink--2022',
      'thinklink--2-2062',
      'thinklink--2-2048',
      'thinklink--2175',
    ],
  },
  { slug: '3d-scan', name: '3D scan определение ВГХ', roots: ['3d-scan'] },
  {
    slug: 'printers',
    name: 'Принтеры этикеток',
    roots: [
      'printers',
      'thinklink--1345',
      'thinklink--1354',
      'thinklink--1461',
      'thinklink--1462',
      'thinklink--1463',
      'thinklink--1350',
      'thinklink--1471',
      'thinklink--1698',
      'thinklink--1998',
      'thinklink--2018',
      'thinklink-rfid-2019',
      'thinklink--2-2233',
      'thinklink--2-2248',
    ],
  },
  {
    slug: 'wifi',
    name: 'Wi-Fi оборудование',
    roots: [
      'wifi',
      'thinklink--1137',
      'thinklink--1332',
      'thinklink--1366',
      'thinklink-wi-fi-1549',
      'thinklink--1577',
      'thinklink-wi-fi-2-1811',
      'thinklink--1880',
      'thinklink--2-2068',
      'thinklink-wifi-2167',
      'thinklink-wifi-2172',
      'thinklink-extremewireless-1525',
      'thinklink--1831',
      'thinklink--8041',
    ],
  },
  {
    slug: 'refurbished',
    name: 'Восстановленные ТСД',
    roots: ['refurbished', 'tsd-used'],
  },
]

type CategoryNode = { id: string; slug: string; parentId: string | null }

// Match the device named at the beginning, not equipment mentioned later in
// an accessory description. Bundles of a device with a PSU remain devices.
export function isEquipmentProduct(section: string, name: string): boolean {
  const title = name.trim()
  switch (section) {
    case 'tsd':
    case 'refurbished':
      return /^(?:комплект\s*:\s*)?(?:(?:мобильный|промышленный|носимый)\s+)?(?:терминал(?:\s|$)|тсд(?:\s|$)|мобильный компьютер)/i.test(
        title
      )
    case 'scanners':
      return /^(?:(?:ручной|промышленный|беспроводной|стационарный|настольный|встраиваемый|проводной)\s+)*(?:сканер|считыватель MATRIX|камера Datalogic AV|OEM модуль сканирования)(?:\s|$)/i.test(
        title
      )
    case 'printers':
      return /^(?:(?:DT|TT|Desktop|Mobile|Industrial|настольный|мобильный|промышленный|термотрансферный|термо)\s+)*принтер(?:\s|\+|$)|^браслетный DT ZD510/i.test(
        title
      )
    case 'wifi':
      return /^(?:[\w.-]+[=]?\s+)?(?:(?:внутренняя|внешняя)\s+)?[тt]очка (?:беспроводного )?доступа|^контроллер (?:беспроводной сети|точек доступа)|^(?:TP-Link [\w.-]+\.\s*)?Wi-Fi контроллер/i.test(
        title
      )
    case '3d-scan':
      return /^(?:измеритель|система измерения|3d.?сканер)/i.test(title)
    default:
      return false
  }
}

export function resolveCategoryIds(categories: CategoryNode[], ids: string[]) {
  const roots = new Set(
    ids.flatMap(
      id =>
        equipmentSections.find(section => section.slug === id)?.roots ?? [id]
    )
  )
  const selected = new Set(
    categories
      .filter(category => roots.has(category.id) || roots.has(category.slug))
      .map(category => category.id)
  )
  let changed = true
  while (changed) {
    changed = false
    for (const category of categories) {
      if (
        category.parentId &&
        selected.has(category.parentId) &&
        !selected.has(category.id)
      ) {
        selected.add(category.id)
        changed = true
      }
    }
  }
  return [...selected]
}
