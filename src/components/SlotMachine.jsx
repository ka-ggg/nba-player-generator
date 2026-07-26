import { useState, useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { Play, StopCircle } from 'lucide-react'
import ParticleBurst from './ParticleBurst'

export default function SlotMachine({ sound }) {
  const teams = useGameStore(s => s.teams)
  const selectedTeam = useGameStore(s => s.selectedTeam)
  const isSpinning = useGameStore(s => s.isSpinning)
  const selectTeam = useGameStore(s => s.selectTeam)
  const triggerAutoStop = useGameStore(s => s.triggerAutoStop)

  const [reelTeams, setReelTeams] = useState([])
  const [isStopping, setIsStopping] = useState(false)
  const [burstTrigger, setBurstTrigger] = useState(0)
  const reelTimerRef = useRef(null)
  const stopTimerRef = useRef(null)
  const spinSoundRef = useRef(null)

  const allTeams = teams // 60 teams

  /* ---- Reel animation ---- */
  useEffect(() => {
    if (isSpinning) {
      setIsStopping(false)
      // start spin sound
      if (sound?.spinStart) {
        spinSoundRef.current = sound.spinStart()
      }
      reelTimerRef.current = setInterval(() => {
        const shuffled = [...allTeams].sort(() => Math.random() - 0.5).slice(0, 12)
        setReelTeams(shuffled)
      }, 80)
    } else if (!isSpinning && reelTeams.length > 0) {
      // stop
      setIsStopping(true)
      clearInterval(reelTimerRef.current)
      // stop spin sound
      if (spinSoundRef.current?.stop) {
        spinSoundRef.current.stop()
        spinSoundRef.current = null
      }
      sound?.playStop?.()

      stopTimerRef.current = setTimeout(() => {
        if (selectedTeam) {
          const team = teams.find(t => t.id === selectedTeam)
          if (team) {
            setReelTeams([team, ...allTeams.filter(t => t.id !== selectedTeam).slice(0, 4)])
          }
        }
        setIsStopping(false)
        // trigger particle burst
        setBurstTrigger(n => n + 1)
      }, 300)
    }

    return () => {
      clearInterval(reelTimerRef.current)
      clearTimeout(stopTimerRef.current)
      if (spinSoundRef.current?.stop) {
        spinSoundRef.current.stop()
        spinSoundRef.current = null
      }
    }
  }, [isSpinning])

  /* ---- Init display ---- */
  useEffect(() => {
    if (!isSpinning && selectedTeam && reelTeams.length === 0) {
      const team = teams.find(t => t.id === selectedTeam)
      if (team) {
        setReelTeams([team, ...allTeams.filter(t => t.id !== selectedTeam).slice(0, 4)])
      }
    }
  }, [selectedTeam])

  /* ---- Click handler ---- */
  const handleGenerate = useCallback(() => {
    if (!selectedTeam || isSpinning) return
    triggerAutoStop()
  }, [selectedTeam, isSpinning, triggerAutoStop])

  return (
    <div className="mt-6">
      {/* Team grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 font-display uppercase tracking-wider">选择球队</span>
          <span className="text-[10px] text-nba-gold/60 font-display ml-1">🏆 现役 · ⭐ 传奇</span>
          <div className="h-px flex-1 bg-nba-border/30" />
        </div>
        {/* Mobile: 3 cols | Desktop: 10 cols */}
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-10 gap-1.5">
          {allTeams.map((team, i) => {
            const isSelected = selectedTeam === team.id
            const isAllTime = team.era === 'all-time'
            return (
              <button
                key={team.id}
                onClick={() => selectTeam(team.id)}
                disabled={isSpinning}
                style={{ animationDelay: `${i * 30}ms` }}
                className={`
                  aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 relative
                  transition-all duration-[250ms] ease-out animate-stagger-fade
                  ${isAllTime
                    ? `border-nba-gold/25 bg-gradient-to-br from-nba-gold/[0.06] to-transparent
                       shadow-[0_0_4px_rgba(230,162,60,0.08)]
                       ${isSelected ? 'animate-legend-shine' : ''}`
                    : 'border-nba-border/40 bg-nba-card/50'
                  }
                  ${isSelected
                    ? `border-nba-gold bg-nba-gold/10 shadow-[0_0_12px_rgba(230,162,60,0.2)] scale-105
                       ${isAllTime ? 'shadow-[0_0_16px_rgba(230,162,60,0.3)]' : ''}`
                    : `hover:border-nba-gold/50 hover:bg-nba-gold/5`
                  }
                  ${isSpinning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
                aria-label={`选择 ${team.name}`}
              >
                {isAllTime && (
                  <span className="absolute top-0.5 right-0.5 text-[6px] font-display font-bold text-nba-bg bg-nba-gold rounded-sm px-1 py-0.5 tracking-[0.05em] leading-none">
                    ALL-TIME
                  </span>
                )}
                <span className="text-sm sm:text-lg">{team.logo}</span>
                <span className={`font-display text-[9px] sm:text-xs ${isAllTime ? 'text-nba-gold' : 'text-nba-gold/80'}`}>
                  {team.abbr}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reel viewport */}
      <div className="relative bg-nba-card rounded-2xl border border-nba-border/50 overflow-hidden card-glow">
        {/* Perspective reel container */}
        <div className="reel-viewport reel-perspective">
          <div className="h-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-nba-bg via-nba-card to-nba-bg">
            <div className={`
              reel-roller flex flex-col items-center gap-1
              ${isSpinning && !isStopping ? 'animate-spin-blur' : ''}
              ${isStopping ? 'animate-spin-stop animate-shake' : ''}
            `}
            style={{
              transform: isSpinning && !isStopping
                ? 'rotateX(15deg) scale(0.9)'
                : isStopping
                  ? 'rotateX(0deg) scale(1.05)'
                  : 'rotateX(0deg) scale(1)',
            }}>
              {reelTeams.slice(0, 5).map((team, index) => (
                <div
                  key={`${team.id}-${index}`}
                  className={`
                    font-display font-bold tracking-wider transition-all duration-200
                    ${index === 2
                      ? 'text-nba-gold text-lg sm:text-3xl scale-110'
                      : 'text-gray-600 text-[10px] sm:text-sm'
                    }
                  `}
                  style={{
                    filter: index !== 2 ? `blur(${Math.abs(index - 2) * 0.8}px)` : 'none',
                    opacity: index === 2 ? 1 : 0.4 + (1 - Math.abs(index - 2) * 0.3),
                  }}
                >
                  {team.abbr} {team.name}
                </div>
              ))}
            </div>
          </div>

          {/* Particle burst overlay */}
          <ParticleBurst trigger={burstTrigger} count={12} />
        </div>

        {/* Center gold line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-nba-gold/40 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-nba-gold/5 pointer-events-none" />

        {/* Generate button */}
        <div className="p-4 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!selectedTeam || isSpinning}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-display font-bold text-sm
              tracking-wider uppercase transition-all duration-200
              ${!selectedTeam || isSpinning
                ? 'bg-nba-border/30 text-gray-600 cursor-not-allowed'
                : 'bg-nba-gold text-nba-bg hover:bg-nba-gold-light active:scale-95 animate-pulse-glow animate-float'
              }
            `}
            aria-label={isSpinning ? '生成中' : '生成球员'}
          >
            {isSpinning ? (
              <><StopCircle className="w-4 h-4" />生成中...</>
            ) : (
              <><Play className="w-4 h-4" />生成球员</>
            )}
          </button>
        </div>
      </div>

      {selectedTeam && (() => {
        const t = teams.find(x => x.id === selectedTeam)
        if (!t) return null
        return (
          <p className="text-center text-xs text-gray-500 mt-2 font-display">
            {t.name} · <span className="text-nba-gold/70">
              {t.era === 'all-time' ? '⭐ 传奇' : '🏆 现役'}
            </span>
          </p>
        )
      })()}
    </div>
  )
}

