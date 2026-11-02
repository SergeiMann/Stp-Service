'use client'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { CatalogState } from '@/lib/catalog-state'
import { ClearableInput } from './ClearableInput'
export interface Category {
  id: string
  slug: string
  name: string
  productsCount: number
  children: Category[]
  aliases?: string[]
}
export interface Brand {
  id: string
  slug: string
  name: string
  productsCount: number
}
export const field =
  'w-full rounded-xl border border-white/10 bg-[#111b31] px-3 py-2.5 text-white placeholder:text-[#6f7b97] focus:border-[#5b84ff]'

// Сколько брендов видно сразу, остальные — по кнопке «Показать все»
const BRANDS_PREVIEW = 12

/** Раздел фильтров, который сворачивается по клику на заголовок */
function FilterSection({ title, count = 0, children }: { title: string; count?: number; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <section className="mx-fsec">
      <button type="button" className="mx-fsec-head" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        <span>{title}</span>
        {count > 0 && <span className="mx-fsec-badge">{count}</span>}
        <i aria-hidden="true" className={`fas fa-chevron-down ml-auto text-[11px] transition-transform duration-300 ${open ? '' : '-rotate-90'}`} />
      </button>
      <div className="mx-fsec-body" data-open={open}>
        <div>
          <div className="pb-1 pt-3">{children}</div>
        </div>
      </div>
    </section>
  )
}

/** Поле поиска внутри фильтра: с иконкой лупы */
function SearchField(props: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  return (
    <span className="relative block">
      <i aria-hidden="true" className="fas fa-magnifying-glass pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-xs text-[#6f7b97]" />
      <ClearableInput
        clearLabel={`Очистить: ${props.label}`}
        aria-label={props.label}
        onClear={() => props.onChange('')}
        className="mx-ffield !pl-9"
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    </span>
  )
}

// Цены в каталоге от сотен рублей до миллионов, поэтому ползунок идет по логарифмической шкале
const STEPS = 1000
const nice = (v: number) => (v < 1000 ? Math.round(v / 10) * 10 : v < 100000 ? Math.round(v / 100) * 100 : Math.round(v / 1000) * 1000)

function PriceRange({
  lo,
  hi,
  min,
  max,
  onCommit,
}: {
  lo: number
  hi: number
  min: string
  max: string
  onCommit: (patch: { min: string; max: string }) => void
}) {
  const base = Math.max(1, lo)
  const ratio = Math.log(hi / base) || 1
  const toPos = (price: number) => Math.round((Math.log(Math.max(price, base) / base) / ratio) * STEPS)
  const toPrice = (pos: number) => nice(base * Math.exp((pos / STEPS) * ratio))

  const [a, setA] = useState(min ? toPos(Number(min)) : 0)
  const [b, setB] = useState(max ? toPos(Number(max)) : STEPS)
  // Значения из адреса страницы (сброс фильтров, ввод в поля) возвращают ползунки на место
  useEffect(() => {
    setA(min ? toPos(Number(min)) : 0)
    setB(max ? toPos(Number(max)) : STEPS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, lo, hi])

  // В адрес страницы значение уходит, когда ползунок отпустили, а не на каждый пиксель
  const commit = () => onCommit({ min: a <= 0 ? '' : String(toPrice(a)), max: b >= STEPS ? '' : String(toPrice(b)) })

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-white tabular-nums">{(a <= 0 ? Math.floor(lo) : toPrice(a)).toLocaleString('ru')} ₽</span>
        <span className="text-[#6f7b97]">—</span>
        <span className="font-semibold text-white tabular-nums">{(b >= STEPS ? Math.ceil(hi) : toPrice(b)).toLocaleString('ru')} ₽</span>
      </div>
      <div className="mx-range" style={{ '--a': `${(a / STEPS) * 100}%`, '--b': `${(b / STEPS) * 100}%` } as CSSProperties}>
        <div className="mx-range-track" />
        <input
          type="range"
          min={0}
          max={STEPS}
          value={a}
          aria-label="Цена от"
          onChange={e => setA(Math.min(Number(e.target.value), b - 10))}
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
        />
        <input
          type="range"
          min={0}
          max={STEPS}
          value={b}
          aria-label="Цена до"
          onChange={e => setB(Math.max(Number(e.target.value), a + 10))}
          onPointerUp={commit}
          onKeyUp={commit}
          onBlur={commit}
        />
      </div>
    </div>
  )
}

export function CatalogSidebar({
  state,
  change,
  categories,
  brands,
  range,
}: {
  state: CatalogState
  change: (s: Partial<CatalogState>) => void
  categories: Category[]
  brands: Brand[]
  range: { minPrice: number | null; maxPrice: number | null }
}) {
  const [categorySearch, setCategorySearch] = useState('')
  const [brandSearch, setBrandSearch] = useState('')
  const [allBrands, setAllBrands] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])
  const toggle = (key: 'category' | 'brand', id: string) =>
    change({
      [key]: state[key].includes(id)
        ? state[key].filter(x => x !== id)
        : [...state[key], id],
    })
  const matches = (c: Category): boolean =>
    c.name.toLocaleLowerCase().includes(categorySearch.toLocaleLowerCase()) ||
    c.children.some(matches)
  function node(c: Category, path: string[] = []) {
    if (
      categorySearch &&
      !matches(c) &&
      !state.category.includes(c.id) &&
      !state.category.includes(c.slug) &&
      !c.aliases?.some(id => state.category.includes(id))
    )
      return null
    const open = !!categorySearch || expanded.includes(c.id)
    const selectedKeys = [c.id, c.slug, ...(c.aliases ?? [])].filter(id => state.category.includes(id))
    const on = selectedKeys.length > 0
    return (
      <li key={c.id}>
        <div className={`mx-tree-row ${on ? 'is-on' : ''}`}>
          {c.children.length > 0 ? (
            <button
              type="button"
              className="mx-tree-toggle"
              aria-label={`Подкатегории: ${c.name}`}
              aria-expanded={open}
              onClick={() =>
                setExpanded(v =>
                  v.includes(c.id) ? v.filter(x => x !== c.id) : [...v, c.id]
                )
              }
            >
              <i className={`fas fa-chevron-right text-[9px] transition-transform duration-300 ${open ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
          ) : (
            <span className="mx-tree-toggle" aria-hidden="true" />
          )}
          <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5 py-2 pr-2">
            <input
              type="checkbox"
              className="mx-checkbox"
              checked={on}
              onChange={() => change({ category: on
                ? state.category.filter(id => !selectedKeys.includes(id))
                : [...state.category, c.id] })}
            />
            <span className="min-w-0 flex-1 break-words leading-snug">
              {c.name}
              {categorySearch && path.length > 0 && (
                <small className="mt-0.5 block text-[11px] text-[#6f7b97]">
                  {path.join(' › ')}
                </small>
              )}
            </span>
            <span className="mx-count">{c.productsCount}</span>
          </label>
        </div>
        {open && c.children.length > 0 && (
          <ul className="mx-tree-children">
            {c.children.map(child => node(child, [...path, c.name]))}
          </ul>
        )}
      </li>
    )
  }

  const visibleBrands = brands.filter(
    b =>
      (b.productsCount > 0 || state.brand.includes(b.id) || state.brand.includes(b.slug)) &&
      b.name.toLowerCase().includes(brandSearch.toLowerCase())
  )
  const shownBrands = allBrands || brandSearch ? visibleBrands : visibleBrands.slice(0, BRANDS_PREVIEW)
  const priceActive = Number(Boolean(state.min)) + Number(Boolean(state.max))
  const hasRange = range.minPrice !== null && range.maxPrice !== null && range.maxPrice > range.minPrice

  return (
    <div className="mx-filters text-sm text-slate-100">
      <FilterSection title="Наличие">
        <div className="mx-segment" role="group" aria-label="Наличие">
          {[
            { value: 'in', label: 'В наличии' },
            { value: 'all', label: 'Все товары' },
          ].map(o => (
            <button key={o.value} type="button" aria-pressed={state.stock === o.value} onClick={() => change({ stock: o.value })}>
              {o.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Цена" count={priceActive}>
        {hasRange ? (
          <PriceRange
            lo={range.minPrice!}
            hi={range.maxPrice!}
            min={state.min}
            max={state.max}
            onCommit={patch => {
              if (patch.min !== state.min || patch.max !== state.max) change(patch)
            }}
          />
        ) : (
          <p className="text-xs text-[#8e9ab6]">{range.minPrice === null ? 'Нет цен для выбранных фильтров' : 'Цена у всех товаров одинаковая'}</p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <label className="mx-price-field">
            <span>от</span>
            <input
              type="number"
              min="0"
              step="any"
              inputMode="numeric"
              aria-label="Цена от, рублей"
              placeholder={range.minPrice === null ? '' : Math.floor(range.minPrice).toLocaleString('ru')}
              value={state.min}
              onChange={e => change({ min: e.target.value })}
            />
          </label>
          <label className="mx-price-field">
            <span>до</span>
            <input
              type="number"
              min="0"
              step="any"
              inputMode="numeric"
              aria-label="Цена до, рублей"
              placeholder={range.maxPrice === null ? '' : Math.ceil(range.maxPrice).toLocaleString('ru')}
              value={state.max}
              onChange={e => change({ max: e.target.value })}
            />
          </label>
        </div>
        {state.min && state.max && Number(state.min) > Number(state.max) && (
          <p role="alert" className="mt-2 text-xs text-amber-300">
            Цена «от» больше цены «до»
          </p>
        )}
      </FilterSection>

      <FilterSection title="Категории" count={state.category.length}>
        <SearchField label="Поиск категории" placeholder="Найти категорию" value={categorySearch} onChange={setCategorySearch} />
        <ul className="mx-scroll mt-3 max-h-80 overflow-y-auto overscroll-contain pr-1">
          {categories.map(c => node(c))}
        </ul>
        {!categories.some(matches) && (
          <p className="py-2 text-[#8e9ab6]">Категории не найдены</p>
        )}
        <p className="mt-2 text-[11px] leading-snug text-[#6f7b97]">
          Числа учитывают вложенные категории и остальные фильтры.
        </p>
      </FilterSection>

      <FilterSection title="Бренды" count={state.brand.length}>
        <SearchField label="Поиск бренда" placeholder="Найти бренд" value={brandSearch} onChange={setBrandSearch} />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {shownBrands.map(b => {
            const key = state.brand.includes(b.slug) ? b.slug : b.id
            const on = state.brand.includes(key)
            return (
              <button
                key={b.id}
                type="button"
                className="mx-brand-toggle"
                aria-pressed={on}
                onClick={() => toggle('brand', key)}
              >
                {on && <i aria-hidden="true" className="fas fa-check text-[10px]" />}
                <span className="break-words">{b.name}</span>
                <span className="mx-count">{b.productsCount}</span>
              </button>
            )
          })}
        </div>
        {!visibleBrands.length && <p className="py-2 text-[#8e9ab6]">Бренды не найдены</p>}
        {!brandSearch && visibleBrands.length > BRANDS_PREVIEW && (
          <button type="button" className="mt-3 text-sm font-medium text-[#cbf23d] hover:text-white" onClick={() => setAllBrands(v => !v)}>
            {allBrands ? 'Свернуть' : `Показать все (${visibleBrands.length})`}
          </button>
        )}
      </FilterSection>
    </div>
  )
}
