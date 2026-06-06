import { useCallback, useEffect, useRef } from 'react'
import { SOUNDS_BY_ID } from '../lib/sounds'
import { useMixerStore, type Channel } from '../store/mixer'

const FADE_S = 0.3

interface ChannelAudioState {
  gainNode: GainNode
  sourceNode: AudioBufferSourceNode
}

export function useAudioEngine() {
  const ctxRef         = useRef<AudioContext | null>(null)
  const masterGainRef  = useRef<GainNode | null>(null)
  const channelsRef    = useRef<Map<string, ChannelAudioState>>(new Map())
  const bufferCacheRef = useRef<Map<string, AudioBuffer>>(new Map())
  const loadingRef     = useRef<Set<string>>(new Set())
  const prevRef        = useRef<Channel[]>([])

  const masterVolumeRef = useRef(useMixerStore.getState().masterVolume)
  const masterVolume    = useMixerStore(s => s.masterVolume)
  const channels        = useMixerStore(s => s.channels)
  const setReady        = useMixerStore(s => s.setAudioContextReady)

  useEffect(() => { masterVolumeRef.current = masterVolume }, [masterVolume])

  // Creates the singleton AudioContext (must be called from a user-gesture handler)
  const ensureContext = useCallback(async () => {
    if (!ctxRef.current) {
      const ctx       = new AudioContext()
      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(masterVolumeRef.current, ctx.currentTime)
      masterGain.connect(ctx.destination)
      ctxRef.current       = ctx
      masterGainRef.current = masterGain
      setReady(true)
    }
    if (ctxRef.current.state === 'suspended') {
      await ctxRef.current.resume()
    }
  }, [setReady])

  // Fetch + decode with in-memory cache; returns null on error
  const loadBuffer = useCallback(async (url: string): Promise<AudioBuffer | null> => {
    const cache = bufferCacheRef.current
    if (cache.has(url)) return cache.get(url)!
    try {
      const ctx      = ctxRef.current
      if (!ctx) return null
      const res      = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const arr      = await res.arrayBuffer()
      const buf      = await ctx.decodeAudioData(arr)
      cache.set(url, buf)
      return buf
    } catch (err) {
      console.error('[AmbientFlow] Failed to load audio:', url, err)
      return null
    }
  }, [])

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
      const buf = await loadBuffer(sound.url)
      if (!buf) return

      // Re-check: user may have stopped the channel while we were loading
      const live = useMixerStore.getState().channels.find(c => c.soundId === soundId)
      if (!live?.playing) return

      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(
        live.volume ?? volume,
        ctx.currentTime + FADE_S,
      )
      gainNode.connect(masterGain)

      const sourceNode = ctx.createBufferSource()
      sourceNode.buffer = buf
      sourceNode.loop   = true
      sourceNode.connect(gainNode)
      sourceNode.start(0)

      channelsRef.current.set(soundId, { gainNode, sourceNode })
    } finally {
      loadingRef.current.delete(soundId)
    }
  }, [loadBuffer])

  const stopChannel = useCallback((soundId: string) => {
    const ctx   = ctxRef.current
    const state = channelsRef.current.get(soundId)
    if (!ctx || !state) return

    const stopAt = ctx.currentTime + FADE_S
    state.gainNode.gain.linearRampToValueAtTime(0, stopAt)
    state.sourceNode.stop(stopAt)

    const { gainNode } = state
    setTimeout(() => gainNode.disconnect(), (FADE_S + 0.15) * 1000)
    channelsRef.current.delete(soundId)
  }, [])

  // Sync Web Audio state whenever the mixer store channels change
  useEffect(() => {
    const prev    = prevRef.current
    const prevMap = new Map(prev.map(c => [c.soundId, c]))
    const currMap = new Map(channels.map(c => [c.soundId, c]))

    // Removed channels → stop
    for (const [soundId] of prevMap) {
      if (!currMap.has(soundId)) stopChannel(soundId)
    }

    for (const ch of channels) {
      const prevCh    = prevMap.get(ch.soundId)
      const audioState = channelsRef.current.get(ch.soundId)

      // Toggle changed
      if (ch.playing !== prevCh?.playing) {
        if (ch.playing) void startChannel(ch)
        else stopChannel(ch.soundId)
      }

      // Volume changed while playing
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

  // Sync master volume
  useEffect(() => {
    const ctx        = ctxRef.current
    const masterGain = masterGainRef.current
    if (!ctx || !masterGain) return
    masterGain.gain.linearRampToValueAtTime(masterVolume, ctx.currentTime + FADE_S)
  }, [masterVolume])

  // Cleanup on unmount
  useEffect(() => {
    const channels    = channelsRef.current
    const bufferCache = bufferCacheRef.current
    return () => {
      void ctxRef.current?.close()
      ctxRef.current        = null
      masterGainRef.current = null
      channels.clear()
      bufferCache.clear()
    }
  }, [])

  return { ensureContext }
}
