import type { Club } from '../types'

export const initialClubs: Club[] = [
  { id: 'vasco', name: 'Vasco', short_name: 'VAS', points: 500, color: '#111827', logo_url: null },
  { id: 'palmeiras', name: 'Palmeiras', short_name: 'PAL', points: 382, color: '#0f6b3d', logo_url: null },
  { id: 'santos', name: 'Santos', short_name: 'SAN', points: 101, color: '#111827', logo_url: null },
  { id: 'sao-paulo', name: 'São Paulo', short_name: 'SAO', points: 61, color: '#c91d35', logo_url: null },
  { id: 'internacional', name: 'Internacional', short_name: 'INT', points: 45, color: '#d71920', logo_url: null },
  { id: 'botafogo', name: 'Botafogo', short_name: 'BOT', points: 22, color: '#151515', logo_url: null },
  { id: 'flamengo', name: 'Flamengo', short_name: 'FLA', points: 19, color: '#b5121b', logo_url: null },
  { id: 'atletico-mg', name: 'Atlético-MG', short_name: 'CAM', points: 16, color: '#111827', logo_url: null },
  { id: 'athletico-pr', name: 'Athletico-PR', short_name: 'CAP', points: 14, color: '#be123c', logo_url: null },
  { id: 'corinthians', name: 'Corinthians', short_name: 'COR', points: 13, color: '#374151', logo_url: null },
  { id: 'remo', name: 'Remo', short_name: 'REM', points: 5, color: '#1d4ed8', logo_url: null },
  { id: 'gremio', name: 'Grêmio', short_name: 'GRE', points: 3, color: '#0891b2', logo_url: null },
  { id: 'vitoria', name: 'Vitória', short_name: 'VIT', points: 3, color: '#dc2626', logo_url: null },
  { id: 'cruzeiro', name: 'Cruzeiro', short_name: 'CRU', points: 1, color: '#2563eb', logo_url: null },
  { id: 'bahia', name: 'Bahia', short_name: 'BAH', points: 0, color: '#2563eb', logo_url: null },
  { id: 'ceara', name: 'Ceará', short_name: 'CEA', points: 0, color: '#111827', logo_url: null },
  { id: 'fluminense', name: 'Fluminense', short_name: 'FLU', points: 0, color: '#7f1d1d', logo_url: null },
  { id: 'fortaleza', name: 'Fortaleza', short_name: 'FOR', points: 0, color: '#1d4ed8', logo_url: null },
  { id: 'sport', name: 'Sport', short_name: 'SPT', points: 0, color: '#b91c1c', logo_url: null },
  { id: 'bragantino', name: 'Bragantino', short_name: 'RBB', points: 0, color: '#dc2626', logo_url: null },
]

const STORAGE_KEY = 'ranking-live-clubes-v1'

export function loadDemoClubs(): Club[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as Club[]
  } catch {
    // Usa a lista inicial caso o navegador bloqueie o armazenamento.
  }
  return initialClubs
}

export function saveDemoClubs(clubs: Club[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs))
    window.dispatchEvent(new CustomEvent('ranking-live-updated'))
  } catch {
    // A interface continua funcionando durante a sessão.
  }
}
