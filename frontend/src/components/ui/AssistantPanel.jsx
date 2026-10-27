import { homeDashboard } from '../../templateGames'
import SampleIcon from './SampleIcon'

export default function AssistantPanel() {
  const assistant = homeDashboard.assistant
  return (
    <aside className="rounded-xl border border-slate-700/70 bg-slate-950/40 flex flex-col p-4" aria-labelledby="assistant-heading">
      <div className="flex items-start gap-3">
        <SampleIcon className="size-10" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="assistant-heading" className="text-lg font-semibold">{assistant.title}</h2>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">PREVIEW</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{assistant.description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {assistant.actions.map((action) => (
          <div key={action.title} className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-800/50 p-3">
            <SampleIcon className="size-10 rounded-full" />
            <div>
              <h3 className="text-sm font-medium">{action.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{action.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-10">
        <label htmlFor="assistant-message" className="mb-2 block text-xs text-slate-400">Ask your gaming assistant</label>
        <textarea id="assistant-message" rows={4} placeholder="Ask about games, achievements, recommendations..." aria-describedby="assistant-note" className="w-full resize-y rounded-xl border border-slate-600 bg-slate-950/40 p-3 text-sm outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-400" />
        <p id="assistant-note" className="mt-2 text-xs text-slate-500">UI preview only. Messages are not sent.</p>
        <p className="mt-4 text-xs text-slate-400">Examples:</p>
        <ul className="mt-2 space-y-2">
          {assistant.examples.map((example) => <li key={example} className="w-fit rounded-full border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300">{example}</li>)}
        </ul>
      </div>
    </aside>
  )
}
