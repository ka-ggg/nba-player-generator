import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { Download, RotateCcw, Check } from 'lucide-react'

export default function ExportPanel({ player }) {
  const triggerAutoStop = useGameStore(s => s.triggerAutoStop)
  const history = useGameStore(s => s.history)
  const [exported, setExported] = useState(false)

  const handleExport = () => {
    useGameStore.getState().exportPlayer(player)
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  const buttons = (
    <>
      <button
        onClick={() => triggerAutoStop()}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-nba-border/50
                   bg-nba-card/80 font-display text-sm font-bold text-gray-300
                   hover:text-white hover:border-nba-gold/50 hover:bg-nba-gold/5
                   active:scale-95 transition-all"
      >
        <RotateCcw className="w-4 h-4" />Roll Again
      </button>

      <button
        onClick={handleExport}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                   bg-nba-gold text-nba-bg font-display text-sm font-bold
                   hover:bg-nba-gold-light active:scale-95 transition-all animate-pulse-glow animate-float"
      >
        {exported ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
        {exported ? 'Copied!' : 'Export JSON'}
      </button>
    </>
  )

  return (
    <>
      {/* Desktop: inline */}
      <div className="hidden sm:flex items-center gap-3 mt-6">
        {buttons}
        {history.length > 1 && (
          <div className="flex items-center gap-2 ml-auto text-xs text-gray-500 font-display">
            <span>History: {history.length}</span>
          </div>
        )}
      </div>

      {/* Mobile: floating bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-nba-bg/90 backdrop-blur-lg border-t border-nba-border/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {buttons}
        </div>
        {/* Safe area padding */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>

      {/* Mobile spacer */}
      <div className="sm:hidden h-20" />
    </>
  )
}

