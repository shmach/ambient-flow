import { Link } from 'react-router-dom'

// ─── sections to build out ───────────────────────────────────────────────────
// Hero        — headline, subheadline, CTA "Open App"
// Features    — 3-4 value props (multi-layer mixing, presets, sleep timer, share)
// Demo        — embedded screenshot / animated GIF of the mixer in action
// Sounds      — grid of available sound categories
// FAQ         — common questions
// Footer      — Ko-fi link, GitHub, privacy/terms stubs
// ─────────────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center"
      style={{ background: 'var(--color-bg, #0b0b16)', color: '#e2e8f0' }}
    >
      {/* TODO: replace with real Hero section */}
      <img src="/icons/icon-192.png" alt="AmbientFlow" className="w-20 h-20 rounded-2xl" />
      <h1 className="text-4xl font-bold">AmbientFlow</h1>
      <p className="text-slate-400 max-w-md">
        Mix ambient sounds, save presets, share your vibe. Focus deeper. Sleep better.
      </p>
      <Link
        to="/app"
        className="px-6 py-3 rounded-xl text-white font-semibold transition-all"
        style={{ background: '#7c3aed' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#6d28d9')}
        onMouseLeave={e => (e.currentTarget.style.background = '#7c3aed')}
      >
        Open App →
      </Link>
    </div>
  )
}
