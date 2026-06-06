import { useMixerStore } from '../store/mixer'
import { SoundChannel } from './SoundChannel'

interface Props {
  ensureContext: () => Promise<void>
  onOpenPicker: () => void
}

export function SoundMixer({ ensureContext, onOpenPicker }: Props) {
  const channels = useMixerStore(s => s.channels)

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-6xl select-none">🎵</div>
        <p className="text-slate-400 text-lg text-center">
          Adicione um som para começar
        </p>
        <button
          onClick={onOpenPicker}
          className="mt-1 px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          + Escolher sons
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {channels.map(channel => (
        <SoundChannel
          key={channel.soundId}
          soundId={channel.soundId}
          ensureContext={ensureContext}
        />
      ))}
    </div>
  )
}
