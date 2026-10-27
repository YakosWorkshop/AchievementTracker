import { Gamepad2, Trophy } from 'lucide-react'

export default function GameCard({ game, view = 'grid', placeholderIcon }) {
  const { progress, progression } = game
  const isList = view === 'list'

  return (
    <article className={`min-w-0 overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950/50 transition-colors hover:border-slate-500 ${isList ? 'flex flex-col sm:flex-row sm:items-center' : ''}`}>
      <img
        src={game.icon}
        alt=""
        loading="lazy"
        className={isList ? 'block h-auto w-full shrink-0 sm:w-80' : 'h-auto w-full'}
      />
      <div className={`min-w-0 space-y-2.5 p-3 ${isList ? 'w-full sm:max-w-md' : ''}`}>
        <h2 className="truncate text-sm font-semibold text-slate-100" title={game.title}>{game.title}</h2>
        <div className="flex items-center gap-1.5 text-sm text-slate-100">
          {placeholderIcon ? <img src={placeholderIcon} alt="" className="size-4 rounded object-cover" /> : <Trophy className="size-4 text-amber-400" aria-hidden="true" />}
          <span>{progress.unlocked} / {progress.total}</span>
          <span className="sr-only">demo achievements unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            role="progressbar"
            aria-label={`${game.title} demo achievement completion`}
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.unlocked}
            className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"
          >
            <div
              className={`h-full rounded-full ${progression === 100 ? 'bg-sky-400' : 'bg-blue-500'}`}
              style={{ width: `${progression}%` }}
            />
          </div>
          <span className="shrink-0 text-right text-xs tabular-nums text-slate-200">{progression}%</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          {placeholderIcon ? <img src={placeholderIcon} alt="" className="size-5 rounded object-cover" /> : <Gamepad2 className="size-5" aria-hidden="true" />}
          <span className="text-xs">{game.platform}</span>
        </div>
      </div>
    </article>
  )
}
