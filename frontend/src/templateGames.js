import gameIcon from './assets/Naughty Bear Gold Edition.png'

// Sample data for UI development; IDs are placeholders, not real trophy-set IDs.
export const templateGames = [
  {
    id: 'template-001',
        progression: 41.379,
        progress: { unlocked: 24, total: 58 },
        status: 'in-progress',
    platform: 'RPCS3',
    title: 'Naughty Bear',
    detail: 'The trophy set of Naughty Bear.',
    icon: gameIcon,
  },
  {
    id: 'template-002',
        progression: 59.259,
        progress: { unlocked: 32, total: 54 },
        status: 'in-progress',
    platform: 'RPCS3',
    title: "Demon's Souls",
    detail: "The trophy set of Demon's Souls.",
    icon: gameIcon,
  },
  {
    id: 'template-003',
        progression: 61.538,
        progress: { unlocked: 48, total: 78 },
        status: 'in-progress',
    platform: 'RPCS3',
    title: 'LittleBigPlanet',
    detail: 'The trophy set of LittleBigPlanet.',
    icon: gameIcon,
  },
  {
    id: 'template-004',
        progression: 73.016,
        progress: { unlocked: 46, total: 63 },
        status: 'in-progress',
    platform: 'RPCS3',
    title: 'Uncharted 2: Among Thieves',
    detail: 'The trophy set of Uncharted 2: Among Thieves.',
    icon: gameIcon,
  },
  {
    id: 'template-005',
        progression: 100,
        progress: { unlocked: 37, total: 37 },
        status: 'completed',
    platform: 'RPCS3',
    title: 'God of War III',
    detail: 'The trophy set of God of War III.',
    icon: gameIcon,
  },
  {
    id: 'template-006',
        progression: 0,
        progress: { unlocked: 0, total: 51 },
        status: 'not-started',
    platform: 'RPCS3',
    title: 'inFAMOUS',
    detail: 'The trophy set of inFAMOUS.',
    icon: gameIcon,
  },
  {
    id: 'template-007',
        progression: 0,
        progress: { unlocked: 0, total: 40 },
        status: 'not-started',
    platform: 'RPCS3',
    title: 'Ratchet & Clank Future: A Crack in Time',
    detail: 'The trophy set of Ratchet & Clank Future: A Crack in Time.',
    icon: gameIcon,
  },
  {
    id: 'template-008',
        progression: 54.902,
        progress: { unlocked: 28, total: 51 },
        status: 'in-progress',
    platform: 'RPCS3',
    title: 'Red Dead Redemption.',
    detail: 'The trophy set of Red Dead Redemption.',
    icon: gameIcon,
  },
]

// Dashboard fixtures and summaries for the sample library, not live account data.
const unlockedAchievements = templateGames.reduce((sum, game) => sum + game.progress.unlocked, 0)
const totalAchievements = templateGames.reduce((sum, game) => sum + game.progress.total, 0)

export const homeDashboard = {
  icon: gameIcon,
  featuredGameId: 'template-001',
  featuredHeadline: 'A little mischief awaits.',
  featuredDescription: 'Return to the island, explore your collection, and work toward your next achievement.',
  completion: Number(((unlockedAchievements / totalAchievements) * 100).toFixed(1)),
  stats: [
    { label: 'Total Games', value: templateGames.length, detail: '+2 this month', tone: 'blue' },
    { label: 'Achievements Unlocked', value: unlockedAchievements, detail: '+24 this month', tone: 'amber' },
    { label: 'Completion Rate', value: `${((unlockedAchievements / totalAchievements) * 100).toFixed(1)}%`, detail: '+5% this month', tone: 'sky' },
    { label: 'Current Streak', value: '12 days', detail: 'Best: 28 days', tone: 'orange' },
  ],
  completionGroups: [
    { label: 'Completed', status: 'completed', tone: 'emerald' },
    { label: 'In Progress', status: 'in-progress', tone: 'blue' },
    { label: 'Not Started', status: 'not-started', tone: 'slate' },
  ].map((group) => {
    const count = templateGames.filter((game) => game.status === group.status).length
    return { ...group, count, percentage: (count / templateGames.length) * 100 }
  }),
  platforms: [{ name: 'RPCS3', icon: gameIcon, count: templateGames.length, percentage: 100 }],
  collectionIds: templateGames.slice(0, 6).map((game) => game.id),
  assistant: {
    title: 'GameVault AI',
    description: 'Your personal gaming assistant.',
    actions: [
      { title: 'Find a new game', description: 'Get personalized recommendations based on your library.' },
      { title: 'Game strategies', description: 'Tips, guides, and achievement help.' },
      { title: 'Analyze my progress', description: 'Insights about your gaming habits.' },
      { title: 'Compare games', description: 'See how different games match your interests.' },
    ],
    examples: ['Suggest games similar to Naughty Bear', 'How can I complete my trophy collection?', 'Which game should I play next?'],
  },
}
