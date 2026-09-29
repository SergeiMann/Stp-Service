import assert from 'node:assert/strict'
import { resolveCategoryIds, isEquipmentProduct } from '../src/lib/equipment-sections'

for (const [section, name] of [
  ['tsd', 'Крепление на запястье WEARABLE HOLDER, MEMOR 10'],
  ['tsd', 'Коммутатор для терминала сбора данных'],
  ['tsd', 'Блок питания для ТСД'],
  ['tsd', 'Зарядное устройство TC5X WORKSTATION DOCK CRADLE'],
  ['scanners', 'Кабель OEM DECODER CABLE 8cm'],
  ['scanners', 'Подставка для сканера Zebra DS2208'],
  ['printers', '105936G-329 Комплект узла транспортировки карт для принтеров'],
  ['printers', 'KIT, Repair, Platen, 300 DPI, ZD420 CARTRIDGE'],
  ['wifi', 'Монтажный комплект рельс 19 для ИБП QTECH'],
  ['wifi', 'Всенаправленная антенна для внешних точек доступа'],
  ['wifi', 'ИБП QTECH Online 3000ВА'],
]) assert.equal(isEquipmentProduct(section, name), false, name)
for (const [section, name] of [
  ['tsd', 'Терминал сбора данных EDA51K с блоком питания'],
  ['tsd', 'Комплект: терминал PS20, кредл, блок питания'],
  ['tsd', 'Мобильный терминал Urovo RT40S'],
  ['scanners', 'Промышленный сканер MATRIX 320'],
  ['scanners', 'Ручной сканер штрих-кода с кабелем'],
  ['printers', 'DT Desktop принтер Bixolon XD5'],
  ['printers', 'Принтер Zebra ZD421, USB, блок питания'],
  ['wifi', 'AIR-SAP2602E-R-K9 Точка доступа Cisco'],
  ['wifi', 'Внешняя точка доступа, встроенная антенна'],
  ['wifi', 'Контроллер беспроводной сети, 12 портов'],
]) assert.equal(isEquipmentProduct(section, name), true, name)

const categories = [
  { id: 'zebra', slug: 'thinklink--1333', parentId: null },
  { id: 'zebra-model', slug: 'mc3300', parentId: 'zebra' },
  { id: 'honeywell', slug: 'thinklink--1348', parentId: null },
  { id: 'pos', slug: 'thinklink-pos-1537', parentId: null },
  { id: 'scanner', slug: 'thinklink--1335', parentId: null },
  { id: 'surveying', slug: 'thinklink-3d-1758', parentId: null },
  { id: 'used-server', slug: 'thinklink-unified-computing-system-refurbished-4531', parentId: null },
  { id: 'labels', slug: 'thinklink--1345', parentId: null },
  { id: 'cards', slug: 'thinklink--1340', parentId: null },
  { id: 'access-points', slug: 'thinklink-wi-fi-1549', parentId: null },
  { id: 'wifi-camera', slug: 'thinklink-wi-fi-6642', parentId: null },
]
assert.deepEqual(new Set(resolveCategoryIds(categories, ['tsd'])), new Set(['zebra', 'zebra-model', 'honeywell']))
assert.deepEqual(resolveCategoryIds(categories, ['scanners']), ['scanner'])
assert.deepEqual(resolveCategoryIds(categories, ['printers']), ['labels'])
assert.deepEqual(resolveCategoryIds(categories, ['wifi']), ['access-points'])
assert.deepEqual(resolveCategoryIds(categories, ['3d-scan', 'refurbished']), [])
assert.deepEqual(resolveCategoryIds(categories, ['zebra-model']), ['zebra-model'])
assert.deepEqual(resolveCategoryIds(categories, ['mc3300']), ['zebra-model'])
assert.deepEqual(new Set(resolveCategoryIds(categories, ['tsd', 'scanners', 'zebra'])), new Set(['zebra', 'zebra-model', 'honeywell', 'scanner']))
assert.deepEqual(resolveCategoryIds([
  ...categories,
  { id: 'dimensioner', slug: '3d-scan', parentId: null },
  { id: 'used-tsd', slug: 'tsd-used', parentId: null },
], ['3d-scan', 'refurbished']), ['dimensioner', 'used-tsd'])
console.log('PASS: equipment sections, descendants, unrelated equipment excluded, empty sections, IDs/slugs, combined selection')
