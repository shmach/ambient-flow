import { useMixerStore } from '../store/mixer'
import { SOUNDS_BY_ID } from '../lib/sounds'
import { SoundIcon } from './SoundIcon'

interface Props {
  soundId: string
  ensureContext: () => Promise<void>
}

export function SoundChannel({ soundId, ensureContext }: Props) {
  const sound          = SOUNDS_BY_ID[soundId]
  const channel        = useMixerStore(s => s.channels.find(c => c.soundId === soundId))
  const toggleChannel  = useMixerStore(s => s.toggleChannel)
  const setVolume      = useMixerStore(s => s.setChannelVolume)
  const removeChannel  = useMixerStore(s => s.removeChannel)

  if (!sound || !channel) return null

  const handleToggle = () => {
    void ensureContext().then(() => toggleChannel(soundId))
  }

  return (
    <div
      className={`relative flex flex-col items-center gap-3 rounded-2xl p-4 border transition-colors duration-300 ${
        channel.playing
          ? 'bg-surface-overlay border-primary/50'
          : 'bg-surface-raised border-white/10'
      }`}
    >
      {channel.playing && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}

      <div className={`mt-1 transition-colors ${channel.playing ? 'text-primary' : 'text-slate-400'}`}>
        <SoundIcon soundId={soundId} className="w-10 h-10" />
      </div>

      <span className="text-sm font-semibold text-white text-center leading-tight">
        {sound.name}
      </span>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={channel.volume}
        onChange={e => setVolume(soundId, Number(e.target.value))}
        className={`w-full h-1.5 cursor-pointer rounded-full transition-opacity ${
          channel.playing ? 'opacity-100' : 'opacity-40'
        }`}
        style={{ accentColor: 'var(--color-primary)' }}
        aria-label={`Volume de ${sound.name}`}
      />

      <div className="flex gap-2 w-full">
        <button
          onClick={handleToggle}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            channel.playing
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
          aria-label={channel.playing ? `Pausar ${sound.name}` : `Tocar ${sound.name}`}
        >
          {channel.playing ? '⏸ Pausar' : '▶ Tocar'}
        </button>
        <button
          onClick={() => removeChannel(soundId)}
          className="w-9 flex items-center justify-center rounded-lg bg-white/10 text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors text-xl leading-none"
          aria-label={`Remover ${sound.name}`}
        >
          ×
        </button>
      </div>
    </div>
  )
}
