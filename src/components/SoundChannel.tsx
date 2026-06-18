import { Play, Pause, X } from 'lucide-react'
import { useMixerStore } from '../store/mixer'
import { SOUNDS_BY_ID } from '../lib/sounds'
import { SoundIcon } from './SoundIcon'

interface Props {
  soundId: string
  ensureContext: () => Promise<void>
}

export function SoundChannel({ soundId, ensureContext }: Props) {
  const sound         = SOUNDS_BY_ID[soundId]
  const channel       = useMixerStore(s => s.channels.find(c => c.soundId === soundId))
  const toggleChannel = useMixerStore(s => s.toggleChannel)
  const setVolume     = useMixerStore(s => s.setChannelVolume)
  const removeChannel = useMixerStore(s => s.removeChannel)

  if (!sound || !channel) return null

  const handleToggle = () => {
    void ensureContext().then(() => toggleChannel(soundId))
  }

  const activeStyle = channel.playing ? {
    background: 'rgba(124,58,237,0.09)',
    borderColor: 'rgba(124,58,237,0.38)',
    boxShadow: '0 0 28px rgba(124,58,237,0.13), inset 0 1px 0 rgba(255,255,255,0.05)',
  } : {
    background: 'rgba(255,255,255,0.025)',
    borderColor: 'rgba(255,255,255,0.07)',
  }

  return (
    <div
      className="relative flex flex-col items-center gap-3 rounded-2xl p-4 border transition-all duration-300 backdrop-blur-sm"
      style={activeStyle}
    >
      {/* Live indicator */}
      {channel.playing && (
        <span className="absolute top-3 right-3 flex items-center justify-center w-2.5 h-2.5">
          <span className="absolute inline-flex w-full h-full rounded-full bg-primary/60 animate-ping" />
          <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
        </span>
      )}

      <div className={`mt-1 transition-colors duration-300 ${channel.playing ? 'text-primary' : 'text-slate-400'}`}>
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
        className={`w-full h-1.5 cursor-pointer rounded-full transition-opacity duration-300 ${
          channel.playing ? 'opacity-100' : 'opacity-35'
        }`}
        style={{ accentColor: 'var(--color-primary)' }}
        aria-label={`Volume de ${sound.name}`}
      />

      <div className="flex gap-2 w-full">
        <button
          onClick={handleToggle}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            channel.playing
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-white/8 text-slate-300 hover:bg-white/15'
          }`}
          aria-label={channel.playing ? `Pausar ${sound.name}` : `Tocar ${sound.name}`}
        >
          {channel.playing
            ? <><Pause className="w-3.5 h-3.5" /> Pausar</>
            : <><Play  className="w-3.5 h-3.5" /> Tocar</>
          }
        </button>
        <button
          onClick={() => removeChannel(soundId)}
          className="w-9 flex items-center justify-center rounded-lg bg-white/8 text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors cursor-pointer"
          aria-label={`Remover ${sound.name}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
