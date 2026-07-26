import { useRef, useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'nba-gen-sound-enabled'

/**
 * Web Audio API sound effects — no external files needed.
 * Default: off (reads from localStorage).
 */
export default function useSound() {
  const ctxRef = useRef(null)
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true' }
    catch { return false }
  })

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(enabled)) }
    catch { /* ignore */ }
  }, [enabled])

  const toggle = useCallback(() => setEnabled(v => !v), [])

  /* ---- Sound Presets ---- */

  // Slot spin: continuous white noise oscillator (start/stop via returned object)
  const spinStart = useCallback(() => {
    if (!enabled) return null
    const ctx = getCtx()
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, ctx.currentTime)
    filter.Q.setValueAtTime(0.5, ctx.currentTime)
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start()
    // modulate frequency for "ticking" effect
    const modInterval = setInterval(() => {
      filter.frequency.setValueAtTime(600 + Math.random() * 800, ctx.currentTime)
    }, 120)
    return {
      stop: () => {
        clearInterval(modInterval)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1)
        source.stop(ctx.currentTime + 0.12)
      }
    }
  }, [enabled, getCtx])

  // Stop ping: short "ding"
  const playStop = useCallback(() => {
    if (!enabled) return
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.22)
  }, [enabled, getCtx])

  // Card appear: low "thump"
  const playAppear = useCallback(() => {
    if (!enabled) return
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.32)
  }, [enabled, getCtx])

  return { enabled, toggle, spinStart, playStop, playAppear }
}

