import { Trophy } from 'lucide-react'
import SampleIcon from './SampleIcon'

const tones = {
  blue: 'bg-blue-500/15 text-blue-400',
  amber: 'bg-amber-500/15 text-amber-400',
  sky: 'bg-sky-500/15 text-sky-400',
  orange: 'bg-orange-500/15 text-orange-400',
}

export default function StatCard({ stat }) {
  return (
    <article className="rounded-xl border border-slate-700/70 bg-slate-950/40 flex items-start gap-3 p-4">
      <div className={`rounded-full p-2 ${tones[stat.tone]}`}>
        <SampleIcon className="size-9 rounded-full" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
        <h2 className="mt-1 text-xs text-slate-400">{stat.label}</h2>
        <p className={`mt-2 text-xs ${stat.tone === 'orange' ? 'text-orange-300' : 'text-emerald-400'}`}>{stat.detail}</p>
      </div>
      <Trophy className="size-4 text-amber-400" aria-hidden="true" />
    </article>
  )
}
