export function LiveBadge() {
  return (
    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-3.5 py-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-red-500">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
      Live &middot; Updated daily
    </div>
  )
}
