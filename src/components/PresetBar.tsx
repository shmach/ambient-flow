import { X } from 'lucide-react'
import { useMixerStore } from '../store/mixer'
import { type Preset, MAX_PRESETS } from '../hooks/usePresets'

interface Props {
  presets: Preset[]
  onLoad: (preset: Preset) => void
  onDelete: (id: string) => void
  onSave: () => void
}

export function PresetBar({ presets, onLoad, onDelete, onSave }: Props) {
  const hasChannels = useMixerStore(s => s.channels.length > 0)
  const atLimit = presets.length >= MAX_PRESETS

  const handleDelete = (e: React.MouseEvent, preset: Preset) => {
    e.stopPropagation()
    if (window.confirm(`Remover o preset "${preset.name}"?`)) {
      onDelete(preset.id)
    }
  }

  return (
    <section>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Presets
        </h2>
        <button
          onClick={onSave}
          disabled={!hasChannels || atLimit}
          title={atLimit ? `Limite de ${MAX_PRESETS} presets atingido` : undefined}
          className="text-xs px-3 py-1.5 rounded-lg bg-white/8 text-slate-300 hover:bg-white/14 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-white/6 hover:border-white/12"
        >
          + Salvar mix
        </button>
        {atLimit && (
          <span className="text-xs text-slate-500">
            {MAX_PRESETS}/{MAX_PRESETS} presets
          </span>
        )}
      </div>

      {presets.length === 0 ? (
        <p className="text-sm text-slate-600">Nenhum preset salvo ainda.</p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {presets.map(preset => (
            <div
              key={preset.id}
              role="button"
              tabIndex={0}
              onClick={() => onLoad(preset)}
              onKeyDown={e => e.key === 'Enter' && onLoad(preset)}
              className="flex items-center gap-1 shrink-0 rounded-full hover:bg-white/12 transition-colors pl-3.5 pr-1.5 py-1.5 cursor-pointer select-none border border-white/8"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            >
              <span className="text-sm text-slate-200 leading-none font-medium">{preset.name}</span>
              <button
                onClick={e => handleDelete(e, preset)}
                className="w-5 h-5 ml-0.5 flex items-center justify-center rounded-full text-slate-500 hover:bg-red-900/50 hover:text-red-400 transition-colors cursor-pointer"
                aria-label={`Remover preset ${preset.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
