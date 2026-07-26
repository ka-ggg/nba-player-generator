import { useEffect, useRef } from 'react'

/**
 * Particle burst — 12 golden specks explode from center on trigger.
 * Each particle has random angle + distance, fades out over ~0.6s.
 */
export default function ParticleBurst({ trigger, count = 12 }) {
  const containerRef = useRef(null)
  const prevTrigger = useRef(trigger)

  useEffect(() => {
    if (trigger === prevTrigger.current) return
    prevTrigger.current = trigger

    const container = containerRef.current
    if (!container) return

    const fragment = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span')
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
      const distance = 40 + Math.random() * 50
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance
      const size = 2 + Math.random() * 3

      particle.style.cssText = `
        position:absolute; left:50%; top:50%;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:#e6a23c;
        box-shadow:0 0 ${size * 2}px #e6a23c;
        pointer-events:none;
        animation:particle-fly 0.6s cubic-bezier(0,0.7,0.3,1) both;
        --dx:${dx}px; --dy:${dy}px;
      `
      fragment.appendChild(particle)
    }
    container.appendChild(fragment)

    const timer = setTimeout(() => {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }, 700)

    return () => clearTimeout(timer)
  }, [trigger, count])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    />
  )
}

