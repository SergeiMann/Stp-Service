'use client'
import { useState } from 'react'
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
  'w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white'
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
    return (
      <li key={c.id} className="py-1">
        <div className="flex items-start gap-1">
          <button
            type="button"
            className="shrink-0 w-6 min-h-8 rounded focus:!outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400"
            disabled={!c.children.length}
            aria-label={`Подкатегории: ${c.name}`}
            aria-expanded={open}
            onClick={() =>
              setExpanded(v =>
                v.includes(c.id) ? v.filter(x => x !== c.id) : [...v, c.id]
              )
            }
          >
            {c.children.length ? (open ? '▾' : '▸') : '·'}
          </button>
          <label className="flex min-w-0 flex-1 cursor-pointer gap-2 py-1">
            <input
              type="checkbox"
              className="mt-1 shrink-0"
              checked={selectedKeys.length > 0}
              onChange={() => change({ category: selectedKeys.length
                ? state.category.filter(id => !selectedKeys.includes(id))
                : [...state.category, c.id] })}
            />
            <span className="min-w-0 break-words">
              {c.name}
              {categorySearch && path.length > 0 && (
                <small className="block text-slate-400">
                  {path.join(' › ')}
                </small>
              )}
            </span>
            <span className="ml-auto text-slate-400">{c.productsCount}</span>
          </label>
        </div>
        {open && c.children.length > 0 && (
          <ul className="ml-3 border-l border-slate-700 pl-1">
            {c.children.map(child => node(child, [...path, c.name]))}
          </ul>
        )}
      </li>
    )
  }
  return (
    <div className="space-y-5 text-sm text-slate-100">
      <label className="block">
        Поиск товаров
        <ClearableInput
          clearLabel="Очистить поиск товаров"
          aria-label="Поиск товаров"
          onClear={() => change({ search: '' })}
          wrapperClassName="mt-2"
          className={field}
          placeholder="Название или артикул"
          value={state.search}
          onChange={e => change({ search: e.target.value })}
        />
      </label>
      <section>
        <h3 className="font-semibold mb-2">Категории</h3>
        <ClearableInput
          clearLabel="Очистить поиск категории"
          onClear={() => setCategorySearch('')}
          aria-label="Поиск категории"
          placeholder="Найти категорию"
          className={field}
          value={categorySearch}
          onChange={e => setCategorySearch(e.target.value)}
        />
        <p className="text-xs text-slate-400 my-2">
          Числа учитывают вложенные категории и остальные фильтры.
        </p>
        <ul className="max-h-64 overflow-y-auto overscroll-contain pr-1">
          {categories.map(c => node(c))}
        </ul>
        {!categories.some(matches) && (
          <p className="py-2 text-slate-400">Категории не найдены</p>
        )}
      </section>
      <section>
        <h3 className="font-semibold mb-2">Бренды</h3>
        <ClearableInput
          clearLabel="Очистить поиск бренда"
          onClear={() => setBrandSearch('')}
          aria-label="Поиск бренда"
          className={field}
          placeholder="Найти бренд"
          value={brandSearch}
          onChange={e => setBrandSearch(e.target.value)}
        />
        <div className="max-h-40 overflow-y-auto overscroll-contain mt-2">
          {brands
            .filter(
              b =>
                (b.productsCount > 0 ||
                  state.brand.includes(b.id) ||
                  state.brand.includes(b.slug)) &&
                b.name.toLowerCase().includes(brandSearch.toLowerCase())
            )
            .map(b => {
              const key = state.brand.includes(b.slug) ? b.slug : b.id
              return (
                <label key={b.id} className="flex gap-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.brand.includes(key)}
                    onChange={() => toggle('brand', key)}
                  />
                  {b.name}
                  <span className="ml-auto text-slate-400">
                    {b.productsCount}
                  </span>
                </label>
              )
            })}
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-2">Цена, ₽</h3>
        <div className="flex gap-2">
          <label className="min-w-0 flex-1">
            От
            <ClearableInput
              clearLabel="Очистить цену от"
              onClear={() => change({ min: '' })}
              aria-label="Цена от"
              type="number"
              min="0"
              step="any"
              className={field}
              placeholder={String(range.minPrice ?? '')}
              value={state.min}
              onChange={e => change({ min: e.target.value })}
            />
          </label>
          <label className="min-w-0 flex-1">
            До
            <ClearableInput
              clearLabel="Очистить цену до"
              onClear={() => change({ max: '' })}
              aria-label="Цена до"
              type="number"
              min="0"
              step="any"
              className={field}
              placeholder={String(range.maxPrice ?? '')}
              value={state.max}
              onChange={e => change({ max: e.target.value })}
            />
          </label>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {range.minPrice === null
            ? 'Нет цен для выбранных фильтров'
            : `Доступно: ${range.minPrice.toLocaleString('ru')}–${range.maxPrice?.toLocaleString('ru')} ₽`}
        </p>
        {state.min && state.max && Number(state.min) > Number(state.max) && (
          <p role="alert" className="text-amber-300">
            Цена «От» больше цены «До»
          </p>
        )}
      </section>
      <label className="block">
        Наличие
        <select
          className={`${field} mt-2`}
          value={state.stock}
          onChange={e => change({ stock: e.target.value })}
        >
          <option value="in">В наличии</option>
          <option value="all">Все товары</option>
        </select>
      </label>
    </div>
  )
}
