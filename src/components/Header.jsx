import { Trophy, Github, Volume2, VolumeX } from 'lucide-react'

export default function Header({ soundEnabled, onToggleSound }) {
  return (
    <header className="border-b border-nba-border/50 bg-nba-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-nba-gold" />
          <h1 className="font-display font-bold text-base sm:text-lg text-nba-gold tracking-wider">
            NBA 球员生成器
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="text-gray-500 hover:text-nba-gold transition-colors p-1"
            aria-label={soundEnabled ? '关闭音效' : '开启音效'}
            title={soundEnabled ? '音效 开' : '音效 关'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-nba-gold transition-colors"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </header>
  )
}

