import { useGameStore } from './store/gameStore'
import useSound from './hooks/useSound'
import Header from './components/Header'
import SlotMachine from './components/SlotMachine'
import PlayerCard from './components/PlayerCard'
import ExportPanel from './components/ExportPanel'

export default function App() {
  const currentPlayer = useGameStore(s => s.currentPlayer)
  const sound = useSound()

  return (
    <div className="min-h-[100dvh] bg-nba-bg bg-court">
      <Header soundEnabled={sound.enabled} onToggleSound={sound.toggle} />
      <main className="max-w-4xl mx-auto px-4 pb-24 sm:pb-12">
        <SlotMachine sound={sound} />
        {currentPlayer ? (
          <>
            <PlayerCard
              key={currentPlayer.id}
              player={currentPlayer}
              onAppear={sound.playAppear}
            />
            <ExportPanel player={currentPlayer} />
          </>
        ) : (
          <div className="text-center mt-20 text-gray-600 font-display">
            <div className="text-7xl sm:text-8xl mb-6">🎰</div>
            <p className="text-lg sm:text-xl">选择一支球队并点击生成</p>
          </div>
        )}
      </main>
    </div>
  )
}

