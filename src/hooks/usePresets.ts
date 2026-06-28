import { useCallback, useState } from 'react'

export interface PresetChannel {
  soundId: string
  volume: number
}

export interface Preset {
  id: string
  name: string
  channels: PresetChannel[]
}

const STORAGE_KEY     = 'ambientflow_presets'
const INITIALIZED_KEY = 'ambientflow_initialized'
export const MAX_PRESETS = 6

const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default-focus',
    name: 'Focus',
    channels: [
      { soundId: 'rain-light',  volume: 0.6 },
      { soundId: 'white-noise', volume: 0.4 },
    ],
  },
  {
    id: 'default-sleep',
    name: 'Sleep',
    channels: [
      { soundId: 'ocean-waves', volume: 0.7 },
      { soundId: 'rain-light',  volume: 0.4 },
    ],
  },
]

function readStorage(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Preset[]) : []
  } catch {
    return []
  }
}

function writeStorage(presets: Preset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>(() => {
    if (!localStorage.getItem(INITIALIZED_KEY)) {
      localStorage.setItem(INITIALIZED_KEY, '1')
      writeStorage(DEFAULT_PRESETS)
      return DEFAULT_PRESETS
    }
    return readStorage()
  })

  const save = useCallback((name: string, channels: PresetChannel[]): Preset | null => {
    let created: Preset | null = null
    setPresets(prev => {
      if (prev.length >= MAX_PRESETS) return prev
      const preset: Preset = { id: `preset-${Date.now()}`, name, channels }
      created = preset
      const next = [...prev, preset]
      writeStorage(next)
      return next
    })
    return created
  }, [])

  const remove = useCallback((id: string) => {
    setPresets(prev => {
      const next = prev.filter(p => p.id !== id)
      writeStorage(next)
      return next
    })
  }, [])

  return { presets, save, remove }
}
