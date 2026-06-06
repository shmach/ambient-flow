import { useEffect, useRef, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
}

export function PresetSaveModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName('')
      // Defer focus so the element is visible first
      const id = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-surface-raised rounded-2xl p-6 w-full max-w-sm border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4">Salvar preset</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do preset..."
              maxLength={40}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-slate-500 border border-white/10 focus:border-primary/60 focus:outline-none transition-colors"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
