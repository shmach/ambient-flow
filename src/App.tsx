import { useAudioEngine } from './hooks/useAudioEngine'

export default function App() {
  const { ensureContext } = useAudioEngine()

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center p-4"
      onClick={() => { void ensureContext() }}
    >
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AmbientFlow</h1>
        <p className="text-slate-400 text-lg">
          Mixer de sons ambiente para foco e relaxamento
        </p>
      </header>
      <main className="w-full max-w-2xl">
        <p className="text-center text-slate-500">
          Adicione um som para começar
        </p>
      </main>
    </div>
  )
}
