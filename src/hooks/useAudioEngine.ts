import { useCallback, useEffect, useRef } from 'react'
import { SOUNDS_BY_ID } from '../lib/sounds'
import { useMixerStore, type Channel } from '../store/mixer'

const FADE_S = 0.3

interface ChannelAudioState {
  gainNode: GainNode
  audioElement: HTMLAudioElement
  mediaSource: MediaElementAudioSourceNode
}

export function useAudioEngine() {
  const ctxRef        = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const channelsRef   = useRef<Map<string, ChannelAudioState>>(new Map())
  const loadingRef    = useRef<Set<string>>(new Set())
  const prevRef       = useRef<Channel[]>([])

  const masterVolumeRef   = useRef(useMixerStore.getState().masterVolume)
  const masterVolume      = useMixerStore(s => s.masterVolume)
  const channels          = useMixerStore(s => s.channels)
  const setReady          = useMixerStore(s => s.setAudioContextReady)
  const audioContextReady = useMixerStore(s => s.audioContextReady)

  useEffect(() => { masterVolumeRef.current = masterVolume }, [masterVolume])

  // Creates the singleton AudioContext (must be called from a user-gesture handler)
  const ensureContext = useCallback(async () => {
    if (!ctxRef.current) {
      const ctx        = new AudioContext()
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(masterVolumeRef.current, ctx.currentTime)
      masterGain.connect(ctx.destination)
      ctxRef.current        = ctx
      masterGainRef.current = masterGain
      setReady(true)
    }
    if (ctxRef.current.state === 'suspended') {
      await ctxRef.current.resume()
    }
  }, [setReady])

  // Stream audio via HTMLAudioElement — playback starts after a few seconds of buffering
  // instead of waiting for the full file to download (critical for 3h files).
  const startChannel = useCallback(async (channel: Channel) => {
    const { soundId, volume } = channel
    if (channelsRef.current.has(soundId)) return
    if (loadingRef.current.has(soundId))  return

    const ctx        = ctxRef.current
    const masterGain = masterGainRef.current
    if (!ctx || !masterGain) return

    const sound = SOUNDS_BY_ID[soundId]
    if (!sound) return

    loadingRef.current.add(soundId)
    try {
      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      audio.src  = sound.url
      audio.loop = true

      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + FADE_S)
      gainNode.connect(masterGain)

      const mediaSource = ctx.createMediaElementSource(audio)
      mediaSource.connect(gainNode)

      await audio.play()

      // Re-check: user may have toggled off while the browser was buffering
      const live = useMixerStore.getState().channels.find(c => c.soundId === soundId)
      if (!live?.playing) {
        audio.pause()
        gainNode.disconnect()
        mediaSource.disconnect()
        return
      }

      channelsRef.current.set(soundId, { gainNode, audioElement: audio, mediaSource })
    } catch (err) {
      console.error('[AmbientFlow] Failed to start audio:', sound.url, err)
    } finally {
      loadingRef.current.delete(soundId)
    }
  }, [])

  const stopChannel = useCallback((soundId: string) => {
    const ctx   = ctxRef.current
    const state = channelsRef.current.get(soundId)
    if (!ctx || !state) return

    const { gainNode, audioElement, mediaSource } = state
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_S)

    setTimeout(() => {
      audioElement.pause()
      gainNode.disconnect()
      mediaSource.disconnect()
    }, (FADE_S + 0.15) * 1000)

    channelsRef.current.delete(soundId)
  }, [])

  // Sync Web Audio state whenever the mixer store channels change
  useEffect(() => {
    const prev    = prevRef.current
    const prevMap = new Map(prev.map(c => [c.soundId, c]))
    const currMap = new Map(channels.map(c => [c.soundId, c]))

    for (const [soundId] of prevMap) {
      if (!currMap.has(soundId)) stopChannel(soundId)
    }

    for (const ch of channels) {
      const prevCh     = prevMap.get(ch.soundId)
      const audioState = channelsRef.current.get(ch.soundId)

      if (ch.playing !== prevCh?.playing) {
        if (ch.playing) void startChannel(ch)
        else stopChannel(ch.soundId)
      }

      if (audioState && prevCh && ch.volume !== prevCh.volume && ch.playing) {
        const ctx = ctxRef.current
        if (ctx) {
          audioState.gainNode.gain.linearRampToValueAtTime(
            ch.volume,
            ctx.currentTime + FADE_S,
          )
        }
      }
    }

    prevRef.current = channels
  }, [channels, startChannel, stopChannel])

  // When context first becomes ready, start any channels already marked as playing
  useEffect(() => {
    if (!audioContextReady) return
    const { channels: current } = useMixerStore.getState()
    for (const ch of current) {
      if (ch.playing && !channelsRef.current.has(ch.soundId)) {
        void startChannel(ch)
      }
    }
  }, [audioContextReady, startChannel])

  // Sync master volume
  useEffect(() => {
    const ctx        = ctxRef.current
    const masterGain = masterGainRef.current
    if (!ctx || !masterGain) return
    masterGain.gain.linearRampToValueAtTime(masterVolume, ctx.currentTime + FADE_S)
  }, [masterVolume])

  // Cleanup on unmount
  useEffect(() => {
    const channels = channelsRef.current
    return () => {
      for (const { audioElement, gainNode, mediaSource } of channels.values()) {
        audioElement.pause()
        gainNode.disconnect()
        mediaSource.disconnect()
      }
      void ctxRef.current?.close()
      ctxRef.current        = null
      masterGainRef.current = null
      channels.clear()
    }
  }, [])

  return { ensureContext }
}
