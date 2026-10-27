import { useState } from 'react'
import { ChevronDown, Filter, LayoutGrid, List, Search } from 'lucide-react'
import GameCard from './ui/GameCard'
import { templateGames } from '../templateGames'


const categories = [
  { value: 'all', label: 'All Games' },
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'not-started', label: 'Not Started' },
]

const controlClass = 'rounded-lg border border-slate-700 bg-slate-800/40 text-sm text-slate-200 outline-none transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400'

function StatusFilter({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 ${active ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-700/60 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60'}`}
    >
      {label}
      <span className={`rounded px-1.5 text-xs tabular-nums ${active ? 'bg-blue-400/30' : 'bg-slate-700/40 text-slate-300'}`}>{count}</span>
    </button>
  )
}

const Library = () => {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [category, setCategory] = useState('all')
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [hideCompleted, setHideCompleted] = useState(false)
  const query = search.trim().toLowerCase()

  const searchedGames = templateGames.filter((game) =>
    (!hideCompleted || game.status !== 'completed') &&
    [game.title, game.detail, game.platform].some((value) => value.toLowerCase().includes(query))
  )
  const visibleGames = searchedGames.filter(({ status }) => category === 'all' || status === category)

  if (sortBy === 'title-asc' || sortBy === 'title-desc') {
    visibleGames.sort((a, b) => sortBy === 'title-asc'
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title))
  } else if (sortBy === 'completion') {
    visibleGames.sort((a, b) => b.progression - a.progression)
  }

  return (
    <section className="min-w-0 min-h-full  bg-slate-900 p-4 text-slate-100 sm:p-6" aria-labelledby="library-heading">
      <header className="flex flex-col gap-6 2xl:flex-row 2xl:items-center 2xl:justify-between">
        <div className="shrink-0">
          <h1 id="library-heading" className="text-4xl font-bold tracking-tight">Library</h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">All your games and achievements in one place.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-56">
            <label htmlFor="library-search" className="sr-only">Search games</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="library-search"
              type="search"
              placeholder="Search games..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className={`${controlClass} h-11 w-full pl-10 pr-3 placeholder:text-slate-500`}
            />
          </div>
          <button
            type="button"
            className={`${controlClass} flex h-11 items-center gap-2 px-3`}
            aria-expanded={showFilters}
            aria-controls="library-filters"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-4" aria-hidden="true" />
            Filters{hideCompleted ? ' (1)' : ''}
          </button>
          <div className="flex overflow-hidden rounded-lg border border-slate-700" role="group" aria-label="Library view">
            {[{ value: 'grid', label: 'Grid view', Icon: LayoutGrid }, { value: 'list', label: 'List view', Icon: List }].map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={`flex size-11 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 ${view === value ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800/40 text-slate-400 hover:text-slate-100'}`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="relative min-w-40 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-1 focus-within:ring-2 focus-within:ring-blue-400">
            <label htmlFor="library-sort" className="block text-xs text-slate-400">Sort by</label>
            <select id="library-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full appearance-none bg-transparent pr-6 text-sm text-slate-100 outline-none [&>option]:bg-slate-900">
              <option value="default">Default order</option>
              <option value="title-asc">Title: A–Z</option>
              <option value="title-desc">Title: Z–A</option>
              <option value="completion">Completion</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          </div>
        </div>
      </header>

      <div id="library-filters" hidden={!showFilters} className="mt-5 rounded-lg border border-slate-700 bg-slate-800/40 p-4">
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input type="checkbox" checked={hideCompleted} onChange={(event) => setHideCompleted(event.target.checked)} className="size-4 accent-blue-500" />
          Hide completed games
        </label>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3" role="group" aria-label="Achievement status">
        {categories.map(({ value, label }) => (
          <StatusFilter
            key={value}
            label={label}
            count={searchedGames.filter(({ status }) => value === 'all' || status === value).length}
            active={category === value}
            onClick={() => setCategory(value)}
          />
        ))}
      </div>
      <p className="mb-4 mt-3 text-xs text-slate-500">Template library · Demo achievement progress</p>

      {visibleGames.length === 0 ? (
        <div role="status" className="rounded-lg border border-dashed border-slate-700 py-16 text-center">
          <Search className="mx-auto mb-3 size-8 text-slate-500" aria-hidden="true" />
          <h2 className="font-semibold">No games found</h2>
          <p className="mt-2 text-sm text-slate-400">Try another search or change your filters.</p>
          <button type="button" className="mt-4 rounded text-sm text-blue-400 hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-blue-400" onClick={() => { setSearch(''); setCategory('all'); setHideCompleted(false) }}>Clear search and filters</button>
        </div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),20rem))] justify-start items-start gap-4' : 'grid grid-cols-1 gap-3'}>
          {visibleGames.map((game) => (
            <GameCard key={game.id} game={game} view={view} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Library
