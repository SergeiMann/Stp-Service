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
import { CatalogPagination } from '@/components/catalog/CatalogPagination'
import { PageLayout } from '@/components/layout/PageLayout'
import { ClearableInput } from '@/components/catalog/ClearableInput'
import { equipmentSections } from '@/lib/equipment-sections'
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
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
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

  // Поиск применяется после паузы в наборе: иначе каждая буква — запрос к серверу и запись в истории
  const [searchText, setSearchText] = useState(state.search)
  const committedSearch = useRef(state.search)
  useEffect(() => {
    // Поиск сменился снаружи (сброс фильтров, кнопка «назад») — показываем его в поле
    if (state.search !== committedSearch.current) {
      committedSearch.current = state.search
      setSearchText(state.search)
    }
  }, [state.search])
  useEffect(() => {
    if (searchText === committedSearch.current) return
    const timer = setTimeout(() => {
      committedSearch.current = searchText
      commit({ ...state, search: searchText, page: 1 })
    }, 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])
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
      c.aliases?.forEach(id => names.set(id, c.name))
      collect(c.children)
    })
  }
  collect(categories)
  equipmentSections.forEach(section => names.set(section.slug, section.name))
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
    chips.push({ key: 'min', label: `От ${Number(state.min).toLocaleString('ru')} ₽`, patch: { min: '' } })
  if (state.max)
    chips.push({ key: 'max', label: `До ${Number(state.max).toLocaleString('ru')} ₽`, patch: { max: '' } })
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
  // Быстрый выбор: те же шесть разделов, что и на главной (каталог понимает их slug как категорию)
  const isSectionActive = (slug: string) => state.category.includes(slug)
  const total = result?.pagination.totalProducts ?? 0
  const activeFilters =
    state.category.length + state.brand.length + Number(Boolean(state.min)) + Number(Boolean(state.max))
  return (
    <div
      className="catalog-focus-scope"
      data-keyboard-navigation={keyboardNavigation}
      onPointerDownCapture={() => setKeyboardNavigation(false)}
      onKeyDownCapture={event => {
        if (event.key === 'Tab') setKeyboardNavigation(true)
      }}
    >
    <PageLayout
      title="Каталог товаров"
      subtitle="Оборудование для автоматизации бизнеса"
      badge="Каталог оборудования"
      compact
    >
      <div className="mx-auto max-w-[1440px] px-4 pb-4 md:px-8 2xl:px-16">
        {/* Панель поиска и сортировки */}
        <div className="mb-4 rounded-[28px] border border-white/10 bg-[#0b1324] p-3 md:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Поиск товаров</span>
              <i aria-hidden="true" className="fas fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#8e9ab6]" />
              <ClearableInput
                clearLabel="Очистить поиск товаров"
                aria-label="Поиск товаров"
                onClear={() => setSearchText('')}
                className={`${field} h-12 !rounded-full !pl-11 text-base`}
                placeholder="Название, артикул или бренд"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => {
                  // Enter применяет поиск сразу, не дожидаясь паузы
                  if (e.key === 'Enter' && searchText !== committedSearch.current) {
                    committedSearch.current = searchText
                    commit({ ...state, search: searchText, page: 1 })
                  }
                }}
              />
            </label>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                ref={opener}
                className="mx-btn mx-btn-primary h-12 px-5 text-sm lg:!hidden"
                onClick={() => setDraft(state)}
              >
                <i aria-hidden="true" className="fas fa-sliders" /> Фильтры
                {activeFilters > 0 && <span className="mx-fsec-badge !bg-[#0b1324] !text-[#cbf23d]">{activeFilters}</span>}
              </button>
              <select
                aria-label="Сортировка"
                className={`${field} h-12 !w-auto !rounded-full pr-8 text-sm`}
                value={state.sort}
                onChange={e => change({ sort: e.target.value })}
              >
                <option value="name">По названию</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
              </select>
              <select
                aria-label="Товаров на странице"
                className={`${field} h-12 !w-auto !rounded-full pr-8 text-sm`}
                value={state.limit}
                onChange={e => change({ limit: Number(e.target.value) })}
              >
                {[12, 24, 48, 96].map(n => (
                  <option key={n} value={n}>
                    по {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Разделы каталога */}
        <div className="mx-scroll -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            <button
              type="button"
              className="mx-cat-pill"
              aria-pressed={state.category.length === 0}
              onClick={() => change({ category: [] })}
            >
              Все разделы
            </button>
            {equipmentSections.map(section => (
              <button
                key={section.slug}
                type="button"
                className="mx-cat-pill"
                aria-pressed={isSectionActive(section.slug)}
                onClick={() => change({ category: isSectionActive(section.slug) ? [] : [section.slug] })}
              >
                {section.name}
              </button>
            ))}
        </div>

        <div className="flex items-start gap-6">
          <aside
            aria-label="Фильтры каталога"
            className="mx-scroll hidden lg:block sticky top-24 w-80 shrink-0 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[28px] border border-white/10 bg-[#0b1324] p-5"
          >
            <div className="mb-5 flex items-center gap-2">
              <i aria-hidden="true" className="fas fa-sliders text-[#8e9ab6]" />
              <h2 className="text-lg font-semibold text-white">Фильтры</h2>
              {activeFilters > 0 && <span className="mx-fsec-badge">{activeFilters}</span>}
              <button onClick={reset} className="ml-auto text-sm text-[#cbf23d] hover:text-white">
                Сбросить
              </button>
            </div>
            {sidebar}
          </aside>
          <main className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p role="status" className="mr-2 text-sm text-[#a9b4cf]">
                {loading
                  ? 'Загрузка товаров…'
                  : error
                    ? ''
                    : `Найдено товаров: ${total.toLocaleString('ru')}`}
              </p>
              {chips.map(c => (
                <button
                  key={c.key}
                  aria-label={`Снять фильтр: ${c.label}`}
                  onClick={() => change(c.patch)}
                  className="max-w-full break-words rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
                >
                  {c.label} <span aria-hidden="true" className="ml-1 text-[#8e9ab6]">×</span>
                </button>
              ))}
              {chips.length > 1 && (
                <button onClick={reset} className="px-2 text-sm text-[#cbf23d] hover:text-white">
                  Сбросить всё
                </button>
              )}
            </div>
            {facetError && (
              <p role="alert" className="mb-3 text-amber-300">
                Не удалось обновить фильтры.{' '}
                <button className="underline" onClick={() => setRetry(v => v + 1)}>Повторить</button>
              </p>
            )}
            {error ? (
              <div role="alert" className="rounded-[28px] border border-white/10 bg-[#0b1324] p-8 text-center text-white">
                <p className="mb-4">{error}</p>
                <button className="mx-btn mx-btn-primary h-11 px-6 text-sm" onClick={() => setRetry(v => v + 1)}>
                  Повторить
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-busy="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="mx-skeleton h-[26rem]" />
                ))}
              </div>
            ) : (
              result && (
                <>
                  {result.products.length === 0 ? (
                    <div className="rounded-[28px] border border-white/10 bg-[#0b1324] px-6 py-12 text-center text-white">
                      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-white/5 text-xl text-[#8e9ab6]">
                        <i aria-hidden="true" className="fas fa-magnifying-glass" />
                      </div>
                      <h2 className="mb-2 text-xl font-semibold">
                        {state.search ? `По запросу «${state.search}» ничего не найдено` : 'Товары не найдены'}
                      </h2>
                      <p className="mb-6 text-sm text-[#a9b4cf]">
                        Проверьте написание или попробуйте искать по артикулу, бренду или типу устройства.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {state.stock === 'in' && (
                          <button className="mx-btn mx-btn-primary h-11 px-5 text-sm" onClick={() => change({ stock: 'all' })}>
                            Искать среди всех товаров
                          </button>
                        )}
                        {activeFilters > 0 && (
                          <button
                            className="mx-btn mx-btn-ghost h-11 px-5 text-sm"
                            onClick={() => change({ category: [], brand: [], min: '', max: '' })}
                          >
                            Убрать фильтры
                          </button>
                        )}
                        {state.search && (
                          <button className="mx-btn mx-btn-ghost h-11 px-5 text-sm" onClick={() => setSearchText('')}>
                            Очистить поиск
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <ProductGrid products={result.products} />
                  )}
                  <CatalogPagination
                    currentPage={result.pagination.currentPage}
                    totalPages={result.pagination.totalPages}
                    onPageChange={page => {
                      commit({ ...state, page })
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  />
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
          className="fixed inset-y-0 left-0 right-auto m-0 h-[100dvh] max-h-none w-[min(24rem,100vw)] max-w-full bg-[#0b1324] text-white p-0 backdrop:bg-black/60"
        >
          <div className="flex h-full flex-col">
            <header className="flex items-center justify-between border-b border-white/10 p-4">
              <h2 className="font-semibold text-lg">Фильтры</h2>
              <button
                aria-label="Закрыть фильтры"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
                onClick={() => setDraft(null)}
              >
                <i aria-hidden="true" className="fas fa-xmark" />
              </button>
            </header>
            <div className="mx-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
              {sidebar}
            </div>
            <footer className="flex gap-3 border-t border-white/10 bg-[#0b1324] p-4">
              <button
                className="rounded-full border border-white/20 px-5 py-3"
                onClick={reset}
              >
                Сбросить
              </button>
              <button
                className="flex-1 rounded-full bg-[#cbf23d] px-4 py-3 font-semibold text-[#0b1324]"
                onClick={() => {
                  commit(draft)
                  setDraft(null)
                }}
              >
                Показать товары
              </button>
            </footer>
          </div>
        </dialog>
      )}
    </PageLayout>
    </div>
  )
}
