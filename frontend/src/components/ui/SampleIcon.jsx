import { homeDashboard } from '../../templateGames'

export default function SampleIcon({ className = '' }) {
  return <img src={homeDashboard.icon} alt="" className={`shrink-0 rounded-lg object-cover ${className}`} />
}
