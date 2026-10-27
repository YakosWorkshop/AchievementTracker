import { homeDashboard } from '../../templateGames'

const dots = { emerald: 'bg-emerald-400', blue: 'bg-blue-500', slate: 'bg-slate-500' }

export default function CompletionOverview() {
  return (
    <section className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4" aria-labelledby="completion-heading">
      <h2 id="completion-heading" className="font-semibold">Completion Overview</h2>
      <p className="mt-1 text-xs text-slate-400">Your achievement progress across all games.</p>
      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
        <div className="relative size-36 shrink-0" role="img" aria-label={`${homeDashboard.completion}% of achievements unlocked overall`}>
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-700" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" pathLength="100" strokeDasharray={`${homeDashboard.completion} 100`} className="text-blue-500" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">{homeDashboard.completion}%</span>
            <span className="text-xs text-slate-400">Overall</span>
          </div>
        </div>
        <dl className="w-full min-w-0 divide-y divide-slate-800">
          {homeDashboard.completionGroups.map((group) => (
            <div key={group.status} className="flex items-center gap-2 py-3 text-xs">
              <span className={`size-3 shrink-0 rounded-full ${dots[group.tone]}`} aria-hidden="true" />
              <dt className="flex-1 text-slate-300">{group.label}</dt>
              <dd className="whitespace-nowrap text-slate-300">{group.count} games</dd>
              <dd className="w-12 text-right tabular-nums text-slate-400">{group.percentage}%</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
