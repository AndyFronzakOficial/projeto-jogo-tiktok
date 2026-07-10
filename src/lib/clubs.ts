import type { Club } from '../types'
import { hasSupabase, supabase } from './supabase'
import { initialClubs, loadDemoClubs, saveDemoClubs } from './demo'

export async function getClubs(): Promise<Club[]> {
  if (!hasSupabase || !supabase) return loadDemoClubs()

  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .order('points', { ascending: false })
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as Club[]
}

export async function addPoint(id: string, amount = 1): Promise<void> {
  if (!hasSupabase || !supabase) {
    const clubs = loadDemoClubs().map((club) =>
      club.id === id ? { ...club, points: Math.max(0, club.points + amount) } : club,
    )
    saveDemoClubs(clubs)
    return
  }

  const { error } = await supabase.rpc('increment_club_points', {
    club_id: id,
    amount,
  })
  if (error) throw error
}

export async function resetPoints(): Promise<void> {
  if (!hasSupabase || !supabase) {
    saveDemoClubs(loadDemoClubs().map((club) => ({ ...club, points: 0 })))
    return
  }
  const { error } = await supabase.from('clubs').update({ points: 0 }).gte('points', 0)
  if (error) throw error
}

export async function restoreDemo(): Promise<void> {
  if (!hasSupabase || !supabase) {
    saveDemoClubs(initialClubs)
    return
  }

  for (const club of initialClubs) {
    const { error } = await supabase.from('clubs').upsert(club)
    if (error) throw error
  }
}
