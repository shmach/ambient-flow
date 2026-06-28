import { useEffect, useState } from 'react'
import { Volume2, Link2, Check, Plus, Coffee, Play, Square, Moon, X } from 'lucide-react'
import { useAudioEngine } from './hooks/useAudioEngine'
import { usePresets, type Preset } from './hooks/usePresets'
import { useMixerStore } from './store/mixer'
import { encodeMix, decodeMix } from './lib/shareUrl'
import { SoundMixer } from './components/SoundMixer'
import { SoundPicker } from './components/SoundPicker'
import { PresetBar } from './components/PresetBar'
import { PresetSaveModal } from './components/PresetSaveModal'
import { WaveBackground } from './components/WaveBackground'
import { MAX_CHANNELS } from './lib/maxChannels'

const SLEEP_PRESETS = [15, 30, 45, 60]

function formatSleepTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const { ensureContext } = useAudioEngine()
  const { presets, save: savePreset, remove: removePreset } = usePresets()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null)

  const masterVolume = useMixerStore(s => s.masterVolume)
  const setMasterVolume = useMixerStore(s => s.setMasterVolume)
  const channels = useMixerStore(s => s.channels)
  const loadPreset = useMixerStore(s => s.loadPreset)
  const stopAll = useMixerStore(s => s.stopAll)
  const startAll = useMixerStore(s => s.startAll)

  const playingCount = channels.filter(c => c.playing).length
  const waveActive = playingCount > 0
  const waveIntensity = playingCount / MAX_CHANNELS

  // Restore mixer state from shared URL on first load
  useEffect(() => {
    const mix = decodeMix(window.location.search)
    if (mix) loadPreset(mix)
  }, [loadPreset])

  // Sleep timer countdown
  useEffect(() => {
    if (sleepSecondsLeft === null) return
    if (sleepSecondsLeft <= 0) {
      stopAll()
      setSleepSecondsLeft(null)
      return
    }
    const id = setTimeout(() => setSleepSecondsLeft(s => (s ?? 1) - 1), 1000)
    return () => clearTimeout(id)
  }, [sleepSecondsLeft, stopAll])

  const handleLoadPreset = (preset: Preset) => {
    void ensureContext().then(() => loadPreset(preset.channels))
  }

  const handleSavePreset = (name: string) => {
    savePreset(name, channels.map(c => ({ soundId: c.soundId, volume: c.volume })))
  }

  const handleCopyLink = async () => {
    const qs = encodeMix(channels.map(c => ({ soundId: c.soundId, volume: c.volume })))
    const url = window.location.origin + window.location.pathname + qs
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-dvh flex flex-col relative">
      <WaveBackground active={waveActive} intensity={waveIntensity} />

      <header className="sticky top-0 z-30 backdrop-blur-md border-b border-white/5 px-4 py-3"
        style={{ background: 'rgba(11,11,22,0.85)' }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <h1 className="flex items-center gap-2 shrink-0">
            <img
              src="/icons/icon-48.png"
              alt="AmbientFlow logo"
              className="w-7 h-7 rounded-lg object-contain"
            />
            <span className="text-xl font-bold hidden sm:block"
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AmbientFlow
            </span>
          </h1>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => void ensureContext().then(startAll)}
              disabled={channels.length === 0 || playingCount === channels.length}
              title="Iniciar todos"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer bg-white/8 text-slate-300 hover:bg-white/14 border border-white/8"
            >
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Play</span>
            </button>
            <button
              onClick={stopAll}
              disabled={playingCount === 0}
              title="Parar todos"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer bg-white/8 text-slate-300 hover:bg-white/14 border border-white/8"
            >
              <Square className="w-4 h-4" />
              <span className="hidden sm:inline">Stop</span>
            </button>
            <button
              onClick={() => { void handleCopyLink() }}
              disabled={channels.length === 0}
              title="Copiar link do mix"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer ${copied
                ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                : 'bg-white/8 text-slate-300 hover:bg-white/14 border border-white/8'
                }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copiado' : 'Link'}</span>
            </button>
            <button
              onClick={() => setPickerOpen(true)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              style={{ background: '#7c3aed', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6d28d9')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7c3aed')}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Som</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full justify-center max-w-2xl mx-auto px-4 py-6 flex flex-col gap-8 relative z-10">
        <SoundMixer
          ensureContext={ensureContext}
          onOpenPicker={() => setPickerOpen(true)}
        />

        <div className="flex items-center gap-4">
          {/* Master volume */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Volume2 className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
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

          <div className="w-px h-4 bg-white/10 shrink-0" />

          {/* Sleep timer */}
          <div className="flex items-center gap-2 shrink-0">
            <Moon className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
            {sleepSecondsLeft === null ? (
              <>
                {SLEEP_PRESETS.map(m => (
                  <button
                    key={m}
                    onClick={() => setSleepSecondsLeft(m * 60)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-200 bg-white/6 text-slate-400 hover:bg-white/12 hover:text-slate-200 border border-white/8"
                  >
                    {m}m
                  </button>
                ))}
              </>
            ) : (
              <>
                <span className="text-sm font-mono font-medium text-violet-400">
                  {formatSleepTime(sleepSecondsLeft)}
                </span>
                <button
                  onClick={() => setSleepSecondsLeft(null)}
                  title="Cancelar timer"
                  className="p-1 rounded-md cursor-pointer text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        <PresetBar
          presets={presets}
          onLoad={handleLoadPreset}
          onDelete={removePreset}
          onSave={() => setSaveModalOpen(true)}
        />
      </main>

      <footer className="relative z-10 border-t border-white/5 py-5 px-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <span>Feito para sessões de foco e relaxamento</span>
          <div className="flex items-center gap-3">
            <a
              href="https://ko-fi.com/ambientflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <Coffee className="w-4 h-4" />
              <span>Ko-fi</span>
            </a>
          </div>
        </div>
      </footer>

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
