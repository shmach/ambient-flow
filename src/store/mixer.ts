import { create } from 'zustand'

export interface Channel {
  soundId: string
  volume: number
  playing: boolean
}

interface MixerStore {
  channels: Channel[]
  masterVolume: number
  audioContextReady: boolean
  addChannel: (soundId: string) => void
  removeChannel: (soundId: string) => void
  toggleChannel: (soundId: string) => void
  setChannelVolume: (soundId: string, volume: number) => void
  setMasterVolume: (volume: number) => void
  setAudioContextReady: (ready: boolean) => void
  loadPreset: (channels: { soundId: string; volume: number }[]) => void
}

const MAX_CHANNELS = 6

export const useMixerStore = create<MixerStore>((set, get) => ({
  channels: [],
  masterVolume: 0.8,
  audioContextReady: false,

  addChannel: (soundId) => {
    const { channels } = get()
    if (channels.length >= MAX_CHANNELS) return
    if (channels.some(c => c.soundId === soundId)) return
    set({ channels: [...channels, { soundId, volume: 0.7, playing: true }] })
  },

  removeChannel: (soundId) => {
    set(state => ({ channels: state.channels.filter(c => c.soundId !== soundId) }))
  },

  toggleChannel: (soundId) => {
    set(state => ({
      channels: state.channels.map(c =>
        c.soundId === soundId ? { ...c, playing: !c.playing } : c,
      ),
    }))
  },

  setChannelVolume: (soundId, volume) => {
    set(state => ({
      channels: state.channels.map(c =>
        c.soundId === soundId ? { ...c, volume } : c,
      ),
    }))
  },

  setMasterVolume: (masterVolume) => set({ masterVolume }),

  setAudioContextReady: (audioContextReady) => set({ audioContextReady }),

  loadPreset: (channels) => {
    set({
      channels: channels.map(c => ({ soundId: c.soundId, volume: c.volume, playing: true })),
    })
  },
}))
