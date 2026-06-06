import { SOUNDS_BY_ID } from './sounds'

export interface MixChannel {
  soundId: string
  volume: number
}

export function encodeMix(channels: MixChannel[]): string {
  if (channels.length === 0) return ''
  const value = channels.map(c => `${c.soundId}:${c.volume.toFixed(2)}`).join(',')
  return `?s=${value}`
}

export function decodeMix(search: string): MixChannel[] | null {
  const raw = new URLSearchParams(search).get('s')
  if (!raw?.trim()) return null

  try {
    const channels = raw
      .split(',')
      .slice(0, 6)
      .map(part => {
        const sep     = part.lastIndexOf(':')
        const soundId = part.slice(0, sep)
        const volume  = parseFloat(part.slice(sep + 1))
        if (!soundId || isNaN(volume) || !SOUNDS_BY_ID[soundId]) throw new Error('invalid')
        return { soundId, volume: Math.max(0, Math.min(1, volume)) }
      })
    return channels.length > 0 ? channels : null
  } catch {
    return null
  }
}
