import { X, Check } from 'lucide-react'
import { SOUNDS, type SoundCategory } from '../lib/sounds'
import { useMixerStore } from '../store/mixer'
import { SoundIcon } from './SoundIcon'

const CATEGORIES: SoundCategory[] = ['Nature', 'Cozy', 'Urban', 'Focus']

interface Props {
  open: boolean
  onClose: () => void
  ensureContext: () => Promise<void>
}

export function SoundPicker({ open, onClose, ensureContext }: Props) {
  const channels   = useMixerStore(s => s.channels)
  const addChannel = useMixerStore(s => s.addChannel)

  if (!open) return null

  const activeIds = new Set(channels.map(c => c.soundId))
  const atLimit   = channels.length >= 6

  const handleAdd = (soundId: string) => {
    void ensureContext().then(() => addChannel(soundId))
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/65 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl max-h-[80vh] flex flex-col border-t border-white/8"
        style={{ background: '#101020' }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <h2 className="text-lg font-semibold text-white">Add Sound</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-slate-400 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {atLimit && (
          <p className="mx-5 mb-1 shrink-0 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2">
            6-channel limit reached. Remove a channel to add another.
          </p>
        )}

        <div className="overflow-y-auto px-5 pb-8 flex-1">
          {CATEGORIES.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SOUNDS.filter(s => s.category === category).map(sound => {
                  const isActive = activeIds.has(sound.id)
                  const disabled = isActive || atLimit
                  return (
                    <button
                      key={sound.id}
                      disabled={disabled}
                      onClick={() => handleAdd(sound.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? 'text-primary border-primary/30'
                          : disabled
                          ? 'text-slate-600 border-transparent cursor-not-allowed'
                          : 'text-slate-200 border-transparent hover:border-white/10'
                      }`}
                      style={isActive
                        ? { background: 'rgba(124,58,237,0.12)' }
                        : disabled
                        ? { background: 'rgba(255,255,255,0.03)' }
                        : { background: 'rgba(255,255,255,0.04)' }
                      }
                      onMouseEnter={e => {
                        if (!disabled) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                      }}
                      onMouseLeave={e => {
                        if (!disabled && !isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                        if (isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.12)'
                      }}
                    >
                      <SoundIcon soundId={sound.id} className="w-6 h-6 shrink-0" />
                      <span className="text-sm font-medium flex-1">{sound.name}</span>
                      {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
