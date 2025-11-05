export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-24">
      <div className="inline-flex items-center gap-3 text-zinc-700">
        <span
          className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-zinc-700 animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm font-medium">Загрузка…</span>
      </div>
    </div>
  )
}


