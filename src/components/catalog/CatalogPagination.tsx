'use client'

export function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages = Array.from(
    new Set([
      1,
      ...Array.from({ length: 5 }, (_, index) => currentPage + index - 2)
        .filter(page => page >= 1 && page <= totalPages),
      totalPages,
    ])
  ).sort((a, b) => a - b)
  const buttonClass =
    'inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm tabular-nums transition-colors focus:!outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 disabled:cursor-default disabled:opacity-35'

  return (
    <nav aria-label="Страницы каталога" className="my-6 text-white">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        <button
          type="button"
          className={`${buttonClass} enabled:hover:bg-white/10`}
          disabled={currentPage === 1}
          aria-label="Предыдущая страница"
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←<span className="ml-1 hidden sm:inline">Назад</span>
        </button>
        {pages.map((page, index) => (
          <span key={page} className="inline-flex items-center gap-1 sm:gap-2">
            {index > 0 && page - pages[index - 1] > 1 && (
              <span aria-hidden="true" className="px-1 text-slate-400">…</span>
            )}
            <button
              type="button"
              className={`${buttonClass} ${page === currentPage ? 'bg-white font-semibold text-slate-900' : 'hover:bg-white/10'}`}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={page === 1 ? 'Первая страница' : page === totalPages ? `Последняя страница, ${page}` : `Страница ${page}`}
              title={page === 1 ? 'Первая страница' : page === totalPages ? 'Последняя страница' : undefined}
              onClick={() => {
                if (page !== currentPage) onPageChange(page)
              }}
            >
              {page}
            </button>
          </span>
        ))}
        <button
          type="button"
          className={`${buttonClass} enabled:hover:bg-white/10`}
          disabled={currentPage === totalPages}
          aria-label="Следующая страница"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="mr-1 hidden sm:inline">Далее</span>→
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-slate-400">
        Страница {currentPage} из {totalPages}
      </p>
    </nav>
  )
}
