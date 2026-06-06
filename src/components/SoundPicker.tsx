import { SOUNDS, type SoundCategory } from '../lib/sounds'
import { useMixerStore } from '../store/mixer'
import { SoundIcon } from './SoundIcon'

const CATEGORIES: SoundCategory[] = ['Natureza', 'Aconchego', 'Urbano', 'Foco']

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
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-surface-raised rounded-t-3xl max-h-[80vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <h2 className="text-lg font-semibold text-white">Adicionar som</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-slate-400 hover:bg-white/20 transition-colors text-xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {atLimit && (
          <p className="mx-5 mb-1 shrink-0 text-xs text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2">
            Limite de 6 canais atingido. Remova um canal para adicionar outro.
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border ${
                        isActive
                          ? 'bg-primary/20 text-primary border-primary/30 cursor-default'
                          : disabled
                          ? 'bg-white/5 text-slate-600 border-transparent cursor-not-allowed'
                          : 'bg-white/5 text-slate-200 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <SoundIcon soundId={sound.id} className="w-6 h-6 shrink-0" />
                      <span className="text-sm font-medium flex-1">{sound.name}</span>
                      {isActive && <span className="text-xs shrink-0">✓</span>}
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
