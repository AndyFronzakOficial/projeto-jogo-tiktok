import { useCallback, useEffect, useMemo, useState } from 'react'
import { Crown, ExternalLink, Minus, Plus, RefreshCcw, RotateCcw, Trophy } from 'lucide-react'
import { ClubBadge } from './components/ClubBadge'
import { addPoint, getClubs, resetPoints, restoreDemo } from './lib/clubs'
import { hasSupabase, supabase } from './lib/supabase'
import { getClubGift } from './lib/gifts'
import type { Club } from './types'

function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setError('')
      setClubs(await getClubs())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os clubes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    if (hasSupabase && supabase) {
      const client = supabase
      const channel = client
        .channel('clubs-ranking-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'clubs' }, () => void load())
        .subscribe()
      return () => { void client.removeChannel(channel) }
    }

    const sync = () => void load()
    window.addEventListener('storage', sync)
    window.addEventListener('ranking-live-updated', sync)
    const interval = window.setInterval(sync, 1000)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('ranking-live-updated', sync)
      window.clearInterval(interval)
    }
  }, [load])

  return { clubs, loading, error, reload: load }
}

export function RankingPage() {
  const { clubs, loading, error } = useClubs()
  const sorted = useMemo(() => [...clubs].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)), [clubs])
  const top = sorted.slice(0, 3)
  const max = Math.max(1, ...sorted.map((club) => club.points))
  const columns = [sorted.slice(0, 10), sorted.slice(10, 20)]

  return (
    <main className="ranking-shell">
      <section className="ranking-card">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <header className="ranking-header">
          <div className="title-row"><Trophy size={28} /><h1>MAIORES CAMPEÕES</h1></div>
          <div className="podium">
            {[0, 1, 2].map((index) => {
              const club = top[index]
              return (
                <div className={`podium-card podium-${index + 1}`} key={club?.id ?? index}>
                  <span className="medal">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  {club ? <ClubBadge club={club} size="lg" /> : <div className="club-badge club-badge-lg" />}
                  <div><strong>{club?.points ?? 0}</strong><small>PONTOS</small></div>
                </div>
              )
            })}
          </div>
        </header>

        <div className="ranking-title"><span>»»»</span><h2>RANKING</h2><span>«««</span></div>

        {loading && <div className="state-message">Carregando ranking...</div>}
        {error && <div className="state-message error">{error}</div>}

        <div className="ranking-list ranking-columns">
          {columns.map((column, columnIndex) => (
            <div className="ranking-column" key={columnIndex}>
              {column.map((club, rowIndex) => {
                const index = columnIndex * 10 + rowIndex
                const gift = getClubGift(club.id)
                return (
                  <article className="ranking-row" key={club.id}>
                    <span className="position">{index + 1}º</span>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.max(5, (club.points / max) * 100)}%`, background: club.color }} /></div>
                    <ClubBadge club={club} />
                    <img className="gift-image" src={gift.image} alt={gift.name} title={gift.name} />
                    <strong className="points">{club.points}</strong>
                    <span className="club-name">{club.name}</span>
                  </article>
                )
              })}
            </div>
          ))}
        </div>

        <footer className="live-footer"><span className="live-dot" /> ATUALIZAÇÃO AO VIVO</footer>
      </section>
    </main>
  )
}

export function ControlPage() {
  const { clubs, loading, error, reload } = useClubs()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const sorted = useMemo(() => [...clubs].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)), [clubs])
  const filtered = sorted.filter((club) => club.name.toLowerCase().includes(query.toLowerCase()))

  async function change(id: string, amount: number) {
    setBusyId(id)
    try {
      await addPoint(id, amount)
      await reload()
    } finally {
      setBusyId(null)
    }
  }

  async function resetAll() {
    if (!window.confirm('Zerar a pontuação de todos os clubes?')) return
    await resetPoints()
    await reload()
  }

  async function restore() {
    if (!window.confirm('Restaurar a pontuação de demonstração?')) return
    await restoreDemo()
    await reload()
  }

  return (
    <main className="control-shell">
      <header className="control-header">
        <div>
          <span className="eyebrow">PAINEL DO OPERADOR</span>
          <h1>Pontuação da live</h1>
          <p>Clique no clube quando o presente chegar. Cada clique soma 1 ponto.</p>
        </div>
        <a className="open-ranking" href="/ranking" target="_blank" rel="noreferrer"><ExternalLink size={18} /> Abrir tela da live</a>
      </header>

      <section className="control-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar clube..." />
        <div className={`connection-pill ${hasSupabase ? 'online' : 'demo'}`}>{hasSupabase ? 'Supabase conectado' : 'Modo demonstração local'}</div>
        <button className="secondary-button" onClick={() => void reload()}><RefreshCcw size={17} /> Atualizar</button>
        <button className="secondary-button" onClick={() => void restore()}><RotateCcw size={17} /> Restaurar demo</button>
        <button className="danger-button" onClick={() => void resetAll()}>Zerar tudo</button>
      </section>

      {loading && <div className="state-message">Carregando clubes...</div>}
      {error && <div className="state-message error">{error}</div>}

      <section className="club-grid">
        {filtered.map((club, index) => (
          <article className="control-club-card" key={club.id}>
            <span className="rank-number">#{index + 1}</span>
            <div className="control-club-visual">
              <ClubBadge club={club} size="lg" />
              <span className="control-gift-icon" title={getClubGift(club.id).name}><img src={getClubGift(club.id).image} alt={getClubGift(club.id).name} /></span>
            </div>
            <div className="control-club-info"><h2>{club.name}</h2><strong>{club.points} pontos</strong><small>{getClubGift(club.id).name} = +1 ponto</small></div>
            <div className="quick-actions">
              <button className="minus-button" disabled={busyId === club.id || club.points === 0} onClick={() => void change(club.id, -1)}><Minus size={22} /></button>
              <button className="point-button" disabled={busyId === club.id} onClick={() => void change(club.id, 1)}><img src={getClubGift(club.id).image} alt="" /><Plus size={20} /> 1 ponto</button>
              <button className="bonus-button" disabled={busyId === club.id} onClick={() => void change(club.id, 5)}>+5</button>
            </div>
          </article>
        ))}
      </section>

      <aside className="operator-tip"><Crown size={20} /> Dica: deixe <strong>/ranking</strong> aberta na captura do TikTok Live Studio e use <strong>/controle</strong> no celular ou em outra aba.</aside>
    </main>
  )
}
