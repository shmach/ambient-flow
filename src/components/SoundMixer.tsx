import { Headphones, Plus } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-2xl scale-150 opacity-50"
            style={{ background: '#7c3aed' }}
          />
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center border border-white/10"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <Headphones className="w-9 h-9 text-slate-400" />
          </div>
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-white font-semibold text-lg">Seu mix está esperando</p>
          <p className="text-slate-500 text-sm">
            Combine sons para criar o ambiente perfeito
          </p>
        </div>

        <button
          onClick={onOpenPicker}
          className="mt-1 px-6 py-2.5 rounded-xl text-white font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer"
          style={{ background: '#7c3aed' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#6d28d9')}
          onMouseLeave={e => (e.currentTarget.style.background = '#7c3aed')}
        >
          <Plus className="w-4 h-4" />
          Escolher sons
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
