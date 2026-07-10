import type { Club } from '../types'

type Props = { club: Club; size?: 'sm' | 'md' | 'lg' }

export function ClubBadge({ club, size = 'md' }: Props) {
  const className = `club-badge club-badge-${size}`
  if (club.logo_url) {
    return <img className={className} src={club.logo_url} alt={`Escudo ${club.name}`} />
  }
  return (
    <div className={className} style={{ background: club.color }} aria-label={`Clube ${club.name}`}>
      <span>{club.short_name}</span>
    </div>
  )
}
