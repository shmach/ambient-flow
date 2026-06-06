import { useEffect, useState } from 'react'
import { useAudioEngine } from './hooks/useAudioEngine'
import { usePresets, type Preset } from './hooks/usePresets'
import { useMixerStore } from './store/mixer'
import { encodeMix, decodeMix } from './lib/shareUrl'
import { SoundMixer } from './components/SoundMixer'
import { SoundPicker } from './components/SoundPicker'
import { PresetBar } from './components/PresetBar'
import { PresetSaveModal } from './components/PresetSaveModal'

export default function App() {
  const { ensureContext }  = useAudioEngine()
  const { presets, save: savePreset, remove: removePreset } = usePresets()

  const [pickerOpen,    setPickerOpen]    = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [copied,        setCopied]        = useState(false)

  const masterVolume    = useMixerStore(s => s.masterVolume)
  const setMasterVolume = useMixerStore(s => s.setMasterVolume)
  const channels        = useMixerStore(s => s.channels)
  const loadPreset      = useMixerStore(s => s.loadPreset)

  // Restore mixer state from shared URL on first load
  useEffect(() => {
    const mix = decodeMix(window.location.search)
    if (mix) loadPreset(mix)
  }, [loadPreset])

  const handleLoadPreset = (preset: Preset) => {
    void ensureContext().then(() => loadPreset(preset.channels))
  }

  const handleSavePreset = (name: string) => {
    savePreset(name, channels.map(c => ({ soundId: c.soundId, volume: c.volume })))
  }

  const handleCopyLink = async () => {
    const qs  = encodeMix(channels.map(c => ({ soundId: c.soundId, volume: c.volume })))
    const url = window.location.origin + window.location.pathname + qs
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-white/5 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <h1 className="text-xl font-bold text-white shrink-0">AmbientFlow</h1>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-slate-500 text-base shrink-0" aria-hidden>🔊</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={e => setMasterVolume(Number(e.target.value))}
              className="flex-1 h-1.5 cursor-pointer rounded-full"
              style={{ accentColor: 'var(--color-primary)' }}
              aria-label="Volume master"
            />
          </div>

          <button
            onClick={() => { void handleCopyLink() }}
            disabled={channels.length === 0}
            title="Copiar link do mix"
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              copied
                ? 'bg-green-600/30 text-green-400'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {copied ? '✓ Copiado' : '🔗 Link'}
          </button>

          <button
            onClick={() => setPickerOpen(true)}
            className="shrink-0 px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            + Som
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-8">
        <SoundMixer
          ensureContext={ensureContext}
          onOpenPicker={() => setPickerOpen(true)}
        />

        <PresetBar
          presets={presets}
          onLoad={handleLoadPreset}
          onDelete={removePreset}
          onSave={() => setSaveModalOpen(true)}
        />
      </main>

      <SoundPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        ensureContext={ensureContext}
      />

      <PresetSaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSavePreset}
      />
    </div>
  )
}
