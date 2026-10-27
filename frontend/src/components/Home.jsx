import { useState } from 'react'
import { Link } from 'react-router'
import { homeDashboard, templateGames } from '../templateGames'
import GameCard from './ui/GameCard'
import SampleIcon from './ui/SampleIcon'
import StatCard from './ui/StatCard'
import CompletionOverview from './ui/CompletionOverview'
import AssistantPanel from './ui/AssistantPanel'

const panelClass = 'rounded-xl border border-slate-700/70 bg-slate-950/40'

const Home = () => {
  const [search, setSearch] = useState('')
  const featured = templateGames.find((game) => game.id === homeDashboard.featuredGameId)
  const collection = templateGames.filter((game) => homeDashboard.collectionIds.includes(game.id) && game.title.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <section className="min-h-full min-w-0  bg-slate-900 p-4 text-slate-100 sm:p-6" aria-labelledby="home-heading">
      <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 id="home-heading" className="text-4xl font-bold tracking-tight">Home</h1>
          <p className="mt-2 text-slate-400">Your gaming achievements at a glance.</p>
        </div>
        <div className="w-full lg:w-80">
          <label htmlFor="home-search" className="sr-only">Search the game collection</label>
          <input id="home-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search collection..." className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 text-sm outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-400" />
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          {featured && (
            <section className={`${panelClass} relative isolate overflow-hidden`} aria-labelledby="featured-heading">
              <img src={featured.icon} alt="" className="absolute inset-0 -z-20 size-full object-cover object-center" />
              <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
              <div className="flex min-h-72 flex-col justify-between gap-6 p-6 xl:flex-row xl:items-end">
                <div className="max-w-md">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-300">Featured game</p>
                  <h2 id="featured-heading" className="mt-3 text-4xl font-bold tracking-tight text-amber-200 sm:text-5xl">{featured.title}</h2>
                  <p className="mt-3 text-xl text-slate-200">{homeDashboard.featuredHeadline}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{homeDashboard.featuredDescription}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/library" className="rounded-lg bg-blue-500 px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-blue-300">Continue to Library <span aria-hidden="true">→</span></Link>
                    <a href="#home-collection" className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-300">View collection</a>
                  </div>
                </div>
                <div className="w-full shrink-0 rounded-xl border border-slate-600/60 bg-slate-950/85 p-4 xl:w-60">
                  <div className="flex items-center gap-3">
                    <SampleIcon className="size-9" />
                    <div><p className="text-2xl font-semibold">{featured.progression}%</p><p className="text-xs text-slate-300">{featured.progress.unlocked} / {featured.progress.total} achievements</p></div>
                  </div>
                  <div role="progressbar" aria-label="Featured game completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={featured.progression} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-blue-500" style={{ width: `${featured.progression}%` }} /></div>
                </div>
              </div>
            </section>
          )}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{homeDashboard.stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</div>
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <CompletionOverview />
            <section className={`${panelClass} p-4`} aria-labelledby="platform-heading">
              <h2 id="platform-heading" className="font-semibold">Platform Breakdown</h2>
              <p className="mt-1 text-xs text-slate-400">Your games across different platforms.</p>
              <div className="mt-6 space-y-5">{homeDashboard.platforms.map((platform) => (
                <div key={platform.name} className="flex items-center gap-3 text-xs">
                  <img src={platform.icon} alt="" className="size-6 rounded object-cover" />
                  <span>{platform.name}</span>
                  <div role="meter" aria-label={`${platform.name} share of library`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={platform.percentage} className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-blue-500" style={{ width: `${platform.percentage}%` }} /></div>
                  <span>{platform.count}</span><span className="text-slate-400">{platform.percentage}%</span>
                </div>
              ))}</div>
              <p className="mt-6 text-xs leading-relaxed text-slate-500">Your sample collection currently contains RPCS3 games only.</p>
            </section>
          </div>
          <section id="home-collection" className={`${panelClass} p-4`} aria-labelledby="collection-heading">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><h2 id="collection-heading" className="font-semibold">Game Collection</h2><p className="mt-1 text-xs text-slate-400">Browse your games and track your progress.</p></div>
              <Link to="/library" className="shrink-0 rounded text-xs text-blue-400 hover:text-blue-300 focus-visible:outline-2 focus-visible:outline-blue-400">View All <span aria-hidden="true">›</span></Link>
            </div>
            {collection.length > 0 ? <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9rem),1fr))] gap-3">{collection.map((game) => <GameCard key={game.id} game={game} placeholderIcon={homeDashboard.icon} />)}</div> : <p role="status" className="py-8 text-center text-sm text-slate-400">No games in this collection match your search.</p>}
          </section>
          <p className="text-xs text-slate-500">Sample dashboard · Progress, activity trends, and streaks are demo data.</p>
        </div>

        <AssistantPanel />
      </div>
    </section>
  )
}

export default Home
