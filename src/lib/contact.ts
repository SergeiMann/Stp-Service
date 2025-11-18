export function equipmentCodeToLabel(code?: string | null): string | undefined {
  if (!code) return undefined
  switch (code) {
    case 'scanner':
      return 'Сканер штрих-кодов'
    case 'printer':
      return 'Термопринтер'
    case 'terminal':
      return 'ТСД/Терминал'
    case 'tablet':
      return 'Планшет'
    case 'other':
      return 'Другое'
    default:
      return code
  }
}


