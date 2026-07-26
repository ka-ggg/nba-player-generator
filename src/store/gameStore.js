import { create } from 'zustand'
import teamsData from '../data/teams.json'
import playersData from '../data/players.json'

function pickPlayer(teamAbbr) {
  const teamPlayers = playersData.filter(p => p.team === teamAbbr)
  if (teamPlayers.length === 0) return null
  const idx = Math.floor(Math.random() * teamPlayers.length)
  const base = teamPlayers[idx]

  // Randomize attributes within ±3 of base
  const attrs = {}
  for (const [k, v] of Object.entries(base.attributes)) {
    const delta = Math.floor(Math.random() * 7) - 3 // -3 to +3
    attrs[k] = Math.max(25, Math.min(99, v + delta))
  }

  const vals = Object.values(attrs)
  const overall = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)

  const grades = [
    { min: 95, grade: 'A+' }, { min: 90, grade: 'A' }, { min: 85, grade: 'A-' },
    { min: 80, grade: 'B+' }, { min: 75, grade: 'B' }, { min: 70, grade: 'B-' },
    { min: 65, grade: 'C+' }, { min: 60, grade: 'C' }, { min: 55, grade: 'C-' },
    { min: 50, grade: 'D+' }, { min: 45, grade: 'D' }, { min: 40, grade: 'D-' },
  ]
  const grade = grades.find(g => overall >= g.min)?.grade || 'F'

  return {
    id: `${base.id}-${Date.now()}`,
    name: base.name,
    team: teamAbbr,
    position: base.position,
    jersey: base.jersey,
    attributes: attrs,
    overall,
    grade,
    badges: base.badges || [],
    generatedAt: Date.now(),
  }
}

export const useGameStore = create((set, get) => ({
  teams: teamsData,
  allPlayers: playersData,
  selectedTeam: null,
  isSpinning: false,
  currentPlayer: null,
  history: [],

  selectTeam: (teamId) => set({ selectedTeam: teamId }),

  startSpin: () => {
    const { selectedTeam, teams } = get()
    if (!selectedTeam) return
    set({ isSpinning: true, currentPlayer: null })
  },

  stopSpin: () => {
    const { selectedTeam, isSpinning, teams } = get()
    if (!isSpinning || !selectedTeam) return

    const team = teams.find(t => t.id === selectedTeam || t.abbr === selectedTeam)
    if (!team) return

    const player = pickPlayer(team.abbr)
    if (!player) return

    set(state => ({
      isSpinning: false,
      currentPlayer: player,
      history: [player, ...state.history].slice(0, 20),
    }))
  },

  // Auto-stop after a random duration
  triggerAutoStop: (duration = null) => {
    const { startSpin, stopSpin } = get()
    startSpin()
    const delay = duration || 2000 + Math.random() * 2000
    setTimeout(() => stopSpin(), delay)
  },

  clearHistory: () => set({ history: [] }),

  exportPlayer: (player) => {
    const data = {
      ...player,
      generatedAt: new Date(player.generatedAt).toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nba-player-${player.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  },
}))

