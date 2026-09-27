'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  CatalogSidebar,
  Category,
  Brand,
  field,
} from '@/components/catalog/CatalogSidebar'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { PageLayout } from '@/components/layout/PageLayout'
import {
  CatalogState,
  catalogQuery,
  defaults,
  parseCatalog,
} from '@/lib/catalog-state'
import { Product } from '@/types'
type Result = {
  products: Product[]
  pagination: {
    currentPage: number
    totalPages: number
    totalProducts: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}
export default function CatalogPage() {
  const params = useSearchParams()
  const key = params?.toString() || ''
  const state = parseCatalog(new URLSearchParams(key))
  const [draft, setDraft] = useState<CatalogState | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [range, setRange] = useState<{
    minPrice: number | null
    maxPrice: number | null
  }>({ minPrice: null, maxPrice: null })
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const query = catalogQuery(state)
  const facetQuery = catalogQuery(draft || state)
  function commit(next: CatalogState, replace = false) {
    const url = `/catalog?${catalogQuery(next)}`
    if (replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
  }
  function change(patch: Partial<CatalogState>) {
    if (draft) setDraft({ ...draft, ...patch, page: 1 })
    else commit({ ...state, ...patch, page: 1 })
  }
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products?${query}`, {
          signal: controller.signal,
        })
        const json = await response.json()
        if (!response.ok || !json.success) throw new Error()
        if (controller.signal.aborted) return
        setResult(json.data)
        setLoading(false)
        if (json.data.pagination.currentPage !== state.page)
          commit({ ...state, page: json.data.pagination.currentPage }, true)
      } catch {
        if (!controller.signal.aborted) {
          setError('Не удалось загрузить товары. Попробуйте ещё раз.')
          setLoading(false)
        }
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
    // The serialized query includes every state field.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, retry])
  const [facetError, setFacetError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const data = await Promise.all(
          ['/api/categories', '/api/brands', '/api/products/price-range'].map(
            async url => {
              const r = await fetch(`${url}?${facetQuery}`, {
                signal: controller.signal,
              })
              const j = await r.json()
              if (!r.ok || !j.success) throw new Error()
              return j.data
            }
          )
        )
        if (!controller.signal.aborted) {
          setCategories(data[0])
          setBrands(data[1])
          setRange(data[2])
          setFacetError(false)
        }
      } catch {
        if (!controller.signal.aborted) setFacetError(true)
      }
    }, 250)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [facetQuery, retry])
  useEffect(() => {
    setDraft(null)
  }, [key])
  const mobile = draft !== null
  useEffect(() => {
    if (!mobile) return
    dialog.current?.showModal()
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = old
      opener.current?.focus()
    }
  }, [mobile])
  const names = new Map<string, string>()
  function collect(nodes: Category[]) {
    nodes.forEach(c => {
      names.set(c.id, c.name)
      names.set(c.slug, c.name)
      collect(c.children)
    })
  }
  collect(categories)
  brands.forEach(b => {
    names.set(b.id, b.name)
    names.set(b.slug, b.name)
  })
  const chips: { key: string; label: string; patch: Partial<CatalogState> }[] =
    []
  if (state.search)
    chips.push({
      key: 'search',
      label: `Поиск: ${state.search}`,
      patch: { search: '' },
    })
  for (const k of ['category', 'brand'] as const)
    state[k].forEach(id =>
      chips.push({
        key: k + id,
        label: names.get(id) || id,
        patch: { [k]: state[k].filter(x => x !== id) },
      })
    )
  if (state.min)
    chips.push({ key: 'min', label: `От ${state.min} ₽`, patch: { min: '' } })
  if (state.max)
    chips.push({ key: 'max', label: `До ${state.max} ₽`, patch: { max: '' } })
  chips.push({
    key: 'stock',
    label: state.stock === 'in' ? 'В наличии' : 'Включая отсутствующие',
    patch: { stock: state.stock === 'in' ? 'all' : 'in' },
  })
  const sidebar = (
    <CatalogSidebar
      state={draft || state}
      change={change}
      categories={categories}
      brands={brands}
      range={range}
    />
  )
  const reset = () =>
    change({ ...defaults, limit: state.limit, sort: state.sort })
  return (
    <PageLayout
      title="Каталог товаров"
      subtitle="Оборудование для автоматизации бизнеса"
      badge="Каталог оборудования"
      backgroundImage="/images/equipment/zebra_ds2208-hc.png"
    >
      <div className="container mx-auto px-4 py-8">
        <button
          ref={opener}
          className="lg:hidden mb-4 rounded-lg bg-blue-600 px-5 py-3 text-white"
          onClick={() => setDraft(state)}
        >
          Фильтры
        </button>
        <div className="flex items-start gap-6">
          <aside
            aria-label="Фильтры каталога"
            className="hidden lg:block sticky top-4 w-72 shrink-0 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-slate-700 bg-slate-800 p-4"
          >
            <h2 className="text-white font-semibold text-lg mb-4">Фильтры</h2>
            {sidebar}
            <button onClick={reset} className="text-blue-300 mt-4 py-2">
              Сбросить всё
            </button>
          </aside>
          <main className="min-w-0 flex-1">
            <div className="flex flex-wrap items-end gap-3 text-white mb-4">
              <label>
                Сортировка
                <select
                  aria-label="Сортировка"
                  className={`${field} mt-1`}
                  value={state.sort}
                  onChange={e => change({ sort: e.target.value })}
                >
                  <option value="name">По названию</option>
                  <option value="price-asc">Цена по возрастанию</option>
                  <option value="price-desc">Цена по убыванию</option>
                </select>
              </label>
              <label>
                На странице
                <select
                  aria-label="Товаров на странице"
                  className={`${field} mt-1`}
                  value={state.limit}
                  onChange={e => change({ limit: Number(e.target.value) })}
                >
                  {[12, 24, 48, 96].map(n => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {chips.map(c => (
                <button
                  key={c.key}
                  aria-label={`Снять фильтр: ${c.label}`}
                  onClick={() => change(c.patch)}
                  className="max-w-full break-words rounded-full border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white"
                >
                  {c.label} ×
                </button>
              ))}
              <button onClick={reset} className="text-blue-300 px-2">
                Сбросить всё
              </button>
            </div>
            {facetError && (
              <p role="alert" className="text-amber-300 mb-3">
                Не удалось обновить фильтры.{' '}
                <button onClick={() => setRetry(v => v + 1)}>Повторить</button>
              </p>
            )}
            <p role="status" className="text-slate-200 mb-4">
              {loading
                ? 'Загрузка товаров…'
                : error
                  ? ''
                  : `Найдено товаров: ${result?.pagination.totalProducts ?? 0}`}
            </p>
            {error ? (
              <div role="alert" className="text-white">
                {error}{' '}
                <button onClick={() => setRetry(v => v + 1)}>Повторить</button>
              </div>
            ) : loading ? (
              <div
                className="h-64 animate-pulse rounded-xl bg-slate-800"
                aria-busy="true"
              />
            ) : (
              result && (
                <>
                  <ProductGrid products={result.products} />
                  {result.pagination.totalPages > 1 && (
                    <nav
                      aria-label="Страницы каталога"
                      className="flex flex-wrap justify-center items-center gap-4 text-white my-6"
                    >
                      <button
                        className="p-3 disabled:opacity-40"
                        disabled={!result.pagination.hasPrevPage}
                        onClick={() =>
                          commit({ ...state, page: state.page - 1 })
                        }
                      >
                        ← Назад
                      </button>
                      <span>
                        {result.pagination.currentPage} /{' '}
                        {result.pagination.totalPages}
                      </span>
                      <button
                        className="p-3 disabled:opacity-40"
                        disabled={!result.pagination.hasNextPage}
                        onClick={() =>
                          commit({ ...state, page: state.page + 1 })
                        }
                      >
                        Далее →
                      </button>
                    </nav>
                  )}
                </>
              )
            )}
          </main>
        </div>
      </div>
      {mobile && (
        <dialog
          ref={dialog}
          onCancel={() => setDraft(null)}
          className="fixed inset-y-0 left-0 right-auto m-0 h-[100dvh] max-h-none w-[min(24rem,100vw)] max-w-full bg-slate-900 text-white p-0 backdrop:bg-black/60"
        >
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between border-b border-slate-700 p-4">
              <h2 className="font-semibold text-lg">Фильтры</h2>
              <button
                aria-label="Закрыть фильтры"
                className="p-2"
                onClick={() => setDraft(null)}
              >
                ✕
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
              {sidebar}
            </div>
            <footer className="flex gap-3 border-t border-slate-700 bg-slate-900 p-4">
              <button
                className="rounded-lg border border-slate-600 px-4 py-3"
                onClick={reset}
              >
                Сбросить
              </button>
              <button
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3"
                onClick={() => {
                  commit(draft)
                  setDraft(null)
                }}
              >
                Применить
              </button>
            </footer>
          </div>
        </dialog>
      )}
    </PageLayout>
  )
}
