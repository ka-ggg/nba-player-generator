import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { ChevronDown } from 'lucide-react'

/* ---- Constants ---- */
const CATEGORIES = [
  { name: '身体素质', icon: '💪', keys: ['speed','strength','vertical','stamina','hustle'] },
  { name: '进攻能力', icon: '🔥', keys: ['threePt','midRange','finish','dunk','ballHandling','passing','postScoring','freeThrow'] },
  { name: '防守能力', icon: '🛡️', keys: ['perimeterD','interiorD','steal','block','defRebound'] },
  { name: '运动能力', icon: '⚡', keys: ['lateralQuickness','acceleration','agility','offRebound'] }
]

const ATTR_LABELS = {
  speed:'速度', strength:'力量', vertical:'弹跳', stamina:'体力', hustle:'积极性',
  threePt:'三分', midRange:'中投', finish:'终结', dunk:'扣篮', ballHandling:'控球',
  passing:'传球', postScoring:'背身', freeThrow:'罚球',
  perimeterD:'外线防守', interiorD:'内线防守', steal:'抢断', block:'盖帽', defRebound:'防守篮板',
  lateralQuickness:'横向敏捷', acceleration:'加速度', agility:'灵活性', offRebound:'进攻篮板'
}

const GRADE_COLORS = {
  'A+': { stroke: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
  'A':  { stroke: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
  'A-': { stroke: '#84cc16', glow: 'rgba(132,204,22,0.4)' },
  'B+': { stroke: '#a3e635', glow: 'rgba(163,230,53,0.4)' },
  'B':  { stroke: '#facc15', glow: 'rgba(250,204,21,0.4)' },
  'B-': { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
  'C+': { stroke: '#f97316', glow: 'rgba(249,115,22,0.4)' },
  'C':  { stroke: '#fb923c', glow: 'rgba(251,146,60,0.4)' },
  'C-': { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
  'D+': { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
  'D':  { stroke: '#dc2626', glow: 'rgba(220,38,38,0.4)' },
  'D-': { stroke: '#dc2626', glow: 'rgba(220,38,38,0.4)' },
  'F':  { stroke: '#991b1b', glow: 'rgba(153,27,27,0.4)' }
}

const BADGE_TOOLTIPS = {
  'Clutch Shooter': '关键时刻投篮更准',
  'Dimer': '传球创造更高命中率',
  'Ankle Breaker': '变向让防守者失去平衡',
  'Posterizer': '隔人暴扣',
  'Rim Protector': '精英级盖帽手',
  'Floor General': '提升场上队友表现',
  'Deadeye': '防守干扰下仍能命中',
  'Pick Pocket': '从持球者手中抢断',
  'Limitless Range': '超远三分射程',
  'Chase Down Artist': '追身大帽',
  'GOAT': '史上最伟大球员',
}

/* ---- Attribute bar color helper ---- */
function barClass(value) {
  if (value >= 85) return 'attr-bar-fill--elite'
  if (value >= 70) return 'attr-bar-fill--good'
  if (value >= 50) return 'attr-bar-fill--mid'
  return 'attr-bar-fill--low'
}

/* ---- OVR Ring sub-component ---- */
function OVRRing({ overall, grade, animate }) {
  const gradeInfo = GRADE_COLORS[grade] || GRADE_COLORS['C']
  const circumference = 2 * Math.PI * 34
  const offset = animate ? circumference * (1 - overall / 99) : circumference

  return (
    <div className="ovr-ring shrink-0">
      <svg viewBox="0 0 80 80">
        <circle className="ring-bg" cx="40" cy="40" r="34" />
        <circle
          className="ring-fill"
          cx="40" cy="40" r="34"
          stroke={gradeInfo.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 6px ${gradeInfo.glow})`,
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      </svg>
      <div className="ring-value">
        <span className="font-display font-black text-2xl sm:text-3xl text-white leading-none">
          {overall}
        </span>
        <span
          className="font-display text-xs font-bold"
          style={{ color: gradeInfo.stroke }}
        >
          {grade}
        </span>
      </div>
    </div>
  )
}

/* ---- Attribute row ---- */
const AttrBar = ({ label, value, visible }) => {
  const pct = Math.max(2, value)
  return (
    <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
      visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
    }`}>
      <span className="text-[11px] text-gray-400 w-20 sm:w-24 text-right shrink-0 font-body truncate">
        {label}
      </span>
      <div className="flex-1 h-3 attr-bar-track rounded-full overflow-hidden">
        <div
          className={`attr-bar-fill h-full rounded-full ${barClass(value)}`}
          style={{ width: visible ? `${pct}%` : '0%' }}
        />
      </div>
      <span className="text-[11px] font-display font-bold text-nba-gold w-7 text-left">
        {visible ? value : '-'}
      </span>
    </div>
  )
}

/* ---- Category accordion (mobile) / static section (desktop) ---- */
function CategorySection({ cat, attrs, visibleBars, isMobile, expanded, onToggle }) {
  if (isMobile) {
    return (
      <div className="border border-nba-border/20 rounded-xl overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-nba-card/50 hover:bg-nba-card transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{cat.icon}</span>
            <span className="text-xs font-display font-bold text-gray-400 uppercase tracking-wider">
              {cat.name}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`} />
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-3 pb-3 pt-2 space-y-1.5">
            {cat.keys.map(key => (
              <AttrBar
                key={key}
                label={ATTR_LABELS[key]}
                value={attrs[key]}
                visible={visibleBars.includes(key)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{cat.icon}</span>
        <h3 className="text-xs font-display font-bold text-gray-400 uppercase tracking-wider">
          {cat.name}
        </h3>
        <div className="h-px flex-1 bg-nba-border/20" />
      </div>
      <div className="space-y-1.5">
        {cat.keys.map(key => (
          <AttrBar
            key={key}
            label={ATTR_LABELS[key]}
            value={attrs[key]}
            visible={visibleBars.includes(key)}
          />
        ))}
      </div>
    </div>
  )
}

/* ---- Main PlayerCard ---- */
export default function PlayerCard({ player, onAppear }) {
  const teams = useGameStore(s => s.teams)
  const [isExiting, setIsExiting] = useState(false)
  const [visibleBars, setVisibleBars] = useState([])
  const [ringAnimate, setRingAnimate] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedCat, setExpandedCat] = useState('身体素质')

  const team = teams.find(t => t.abbr === player.team)

  /* ---- Mobile detection ---- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* ---- Card enter animation ---- */
  useEffect(() => {
    setIsExiting(true)
    const exitTimer = setTimeout(() => setIsExiting(false), 50)

    // OVR ring fill
    setTimeout(() => setRingAnimate(true), 200)

    // Trigger sound callback
    onAppear?.()

    return () => clearTimeout(exitTimer)
  }, [player.id])

  /* ---- Attribute bar stagger ---- */
  useEffect(() => {
    setVisibleBars([])
    setRingAnimate(false)
    const allKeys = Object.keys(player.attributes)
    const timers = allKeys.map((key, i) =>
      setTimeout(() => setVisibleBars(prev => [...prev, key]), 350 + i * 50)
    )
    return () => timers.forEach(clearTimeout)
  }, [player.id])

  /* ---- Toggle mobile category ---- */
  const toggleCat = useCallback((name) => {
    setExpandedCat(prev => prev === name ? '' : name)
  }, [])

  return (
    <div className={`mt-6 transition-all duration-300 ${
      isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div
        className="card-metallic card-shimmer card-corners rounded-2xl overflow-hidden animate-fade-in-up relative"
        style={{
          background: `linear-gradient(145deg, ${team?.color || '#1a1a2e'}18 0%, #12121a 45%, #12121a 100%)`,
        }}
      >
        {/* Team logo watermark */}
        <div
          className="absolute right-2 sm:right-4 top-4 text-[80px] sm:text-[120px] leading-none select-none pointer-events-none opacity-[0.04]"
          aria-hidden="true"
        >
          {team?.logo || '🏀'}
        </div>

        {/* ---- Header ---- */}
        <div className="relative p-4 sm:p-5 border-b border-nba-border/30 z-[3]">
          <div className="flex items-center justify-between gap-3">
            {/* Jersey + name */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${team?.color || '#333'}, ${team?.secondaryColor || '#555'})`,
                }}
              >
                {/* Diagonal cut */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.3) 52%, transparent 52%)`,
                  }}
                />
                <span className="relative font-display font-black text-lg sm:text-xl text-white z-[1]">
                  {player.jersey}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-base sm:text-lg text-white truncate">
                  {player.name}
                </h2>
                <p className="text-xs text-gray-400 font-body">
                  {team?.name || player.team} · {player.position}
                </p>
              </div>
            </div>

            {/* OVR Ring */}
            <OVRRing overall={player.overall} grade={player.grade} animate={ringAnimate} />
          </div>
        </div>

        {/* ---- Badges (hexagonal) ---- */}
        {player.badges?.length > 0 && (
          <div className="relative px-4 sm:px-5 py-3 border-b border-nba-border/20 flex flex-wrap gap-2 z-[3]">
            {player.badges.map((badge, i) => (
              <div key={i} className="group relative">
                <span
                  className="badge-hex text-[9px] font-display font-bold text-nba-gold px-3 py-1"
                  title={BADGE_TOOLTIPS[badge] || badge}
                >
                  {badge}
                </span>
                {/* Tooltip */}
                {BADGE_TOOLTIPS[badge] && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-nba-card border border-nba-border/50 rounded text-[10px] text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    {BADGE_TOOLTIPS[badge]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ---- Attributes ---- */}
        <div className="relative p-4 sm:p-5 space-y-4 z-[3]">
          {CATEGORIES.map(cat => (
            <CategorySection
              key={cat.name}
              cat={cat}
              attrs={player.attributes}
              visibleBars={visibleBars}
              isMobile={isMobile}
              expanded={expandedCat === cat.name}
              onToggle={() => toggleCat(cat.name)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

