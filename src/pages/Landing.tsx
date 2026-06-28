import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  CloudRain, Zap, Waves, TreePine, Flame, Building2, BookOpen,
  Radio, Wind, Volume2, Layers, SlidersHorizontal, BookmarkCheck,
  Share2, Moon, Wifi, ChevronDown, Coffee, ArrowRight, Target, Leaf,
} from 'lucide-react'

// ─── Scroll-reveal wrapper ──────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = '',
  from = 'bottom',
}: {
  children: ReactNode
  delay?: number
  className?: string
  from?: 'bottom' | 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const tx = { bottom: 'translateY(28px)', left: 'translateX(-28px)', right: 'translateX(28px)' }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : tx[from],
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Mini mixer preview card ────────────────────────────────────────────────
function MixerPreview() {
  const channels = [
    { Icon: CloudRain, name: 'Light Rain', vol: 75, color: '#818cf8' },
    { Icon: Flame, name: 'Campfire', vol: 45, color: '#f97316' },
    { Icon: Wind, name: 'White Noise', vol: 60, color: '#34d399' },
  ]
  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl w-full max-w-xs mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Focus Mix</span>
        <span className="flex gap-1 items-center">
          {[0, 300, 600].map(ms => (
            <span
              key={ms}
              className="w-1.5 h-1.5 rounded-full bg-violet-400"
              style={{ animation: `pulse 1.5s ease-in-out ${ms}ms infinite` }}
            />
          ))}
        </span>
      </div>

      <div className="space-y-3.5">
        {channels.map(({ Icon, name, vol, color }) => (
          <div key={name} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
              style={{ background: color + '18' }}
            >
              <Icon className="w-4 h-4" style={{ color }} aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-300 mb-1.5 font-medium">{name}</div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${vol}%`, background: color, animation: 'bar-grow 0.9s ease both' }}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-500 w-7 text-right tabular-nums">{vol}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3.5 border-t border-white/8 flex items-center gap-3">
        <Volume2 className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden />
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: '70%',
              background: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
              animation: 'bar-grow 1s ease 0.3s both',
            }}
          />
        </div>
        <span className="text-[11px] text-slate-500 tabular-nums">70%</span>
      </div>
    </div>
  )
}

// ─── FAQ accordion item ─────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 cursor-pointer hover:bg-white/4 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-medium text-slate-200 text-sm sm:text-base">{q}</span>
        <ChevronDown
          className="w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          aria-hidden
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? '200px' : '0' }}
      >
        <p className="px-5 pb-4 text-slate-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

// ─── JSON-LD structured data ────────────────────────────────────────────────
const JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AmbientFlow',
  description:
    'Free customizable ambient sound mixer. Combine rain, fire, ocean, forest and more with individual volume control. Save presets for focus, sleep, and relaxation.',
  url: 'https://ambient-flow.vercel.app/',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any (Web)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Multi-layer ambient sound mixing',
    'Individual volume control per channel',
    'Save and load named presets',
    'Sleep timer (15–60 min)',
    'Share mix via URL',
    'Offline support via PWA',
  ],
})

// ─── Static data ────────────────────────────────────────────────────────────
const CATEGORY_STYLE: Record<string, { text: string; bg: string }> = {
  Nature: { text: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  Cozy: { text: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  Urban: { text: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  Focus: { text: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
}

const SOUNDS = [
  { Icon: CloudRain, name: 'Light Rain', category: 'Nature' },
  { Icon: CloudRain, name: 'Heavy Rain', category: 'Nature' },
  { Icon: Zap, name: 'Thunderstorm', category: 'Nature' },
  { Icon: Waves, name: 'Ocean Waves', category: 'Nature' },
  { Icon: TreePine, name: 'Forest', category: 'Nature' },
  { Icon: Flame, name: 'Campfire', category: 'Cozy' },
  { Icon: Flame, name: 'Fireplace', category: 'Cozy' },
  { Icon: BookOpen, name: 'Library', category: 'Urban' },
  { Icon: Building2, name: 'City Night', category: 'Urban' },
  { Icon: Radio, name: 'White Noise', category: 'Focus' },
  { Icon: Wind, name: 'Brown Noise', category: 'Focus' },
]

const FEATURES = [
  {
    Icon: Layers,
    title: 'Multi-Layer Mixing',
    desc: "Combine up to 6 sounds simultaneously. Stack rain, fire, and ocean to craft a soundscape that's entirely yours.",
    accent: 'text-violet-400',
    glow: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Per-Channel Volume',
    desc: 'Fine-tune every sound independently. More rain, less wind — dial in exactly the balance you need.',
    accent: 'text-blue-400',
    glow: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    Icon: BookmarkCheck,
    title: 'Save Presets',
    desc: 'Name and save any mix as a preset. Load your Focus, Sleep, or Study environments instantly.',
    accent: 'text-emerald-400',
    glow: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    Icon: Share2,
    title: 'Share Your Mix',
    desc: 'Copy a link that encodes your exact soundscape — volumes and all. Share with anyone, anywhere.',
    accent: 'text-orange-400',
    glow: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    Icon: Moon,
    title: 'Sleep Timer',
    desc: 'Set a 15–60 minute timer and drift off. AmbientFlow stops automatically so you don\'t wake up to silence.',
    accent: 'text-indigo-400',
    glow: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    Icon: Wifi,
    title: 'Works Offline',
    desc: 'Install as a PWA and your sounds stay available even without an internet connection.',
    accent: 'text-teal-400',
    glow: 'bg-teal-500/10 border-teal-500/20',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Pick your sounds',
    desc: 'Browse Nature, Cozy, Urban, and Focus categories. Add up to 6 sounds to your personal mixer.',
  },
  {
    n: '02',
    title: 'Balance the mix',
    desc: 'Adjust each channel\'s volume and the master slider until the blend feels exactly right.',
  },
  {
    n: '03',
    title: 'Save or share',
    desc: 'Save as a named preset, or copy a link — your exact mix, shareable with anyone.',
  },
]

const USE_CASES = [
  {
    Icon: Target,
    title: 'Deep Focus',
    desc: 'Block distractions and enter flow state. Brown noise + light rain forms an impenetrable wall of productive quiet.',
    gradient: 'from-violet-600/20 to-blue-600/20',
    border: 'border-violet-500/20',
    accent: 'text-violet-300',
    iconColor: 'text-violet-400',
    sounds: ['Brown Noise', 'Light Rain', 'Library'],
  },
  {
    Icon: Moon,
    title: 'Fall Asleep',
    desc: 'Drift off faster and sleep deeper. Ocean waves + fireplace with the sleep timer — no audio running all night.',
    gradient: 'from-blue-600/20 to-indigo-600/20',
    border: 'border-blue-500/20',
    accent: 'text-blue-300',
    iconColor: 'text-blue-400',
    sounds: ['Ocean Waves', 'Fireplace', 'Light Rain'],
  },
  {
    Icon: Leaf,
    title: 'Relax & Recharge',
    desc: 'Wind down after a long day. Forest + campfire brings nature indoors for a real mental reset.',
    gradient: 'from-emerald-600/20 to-teal-600/20',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-300',
    iconColor: 'text-emerald-400',
    sounds: ['Forest', 'Campfire', 'Thunderstorm'],
  },
]

const FAQS = [
  { q: 'Is AmbientFlow free to use?', a: 'Yes, completely free. If you find it useful, you can support development via Ko-fi — but it\'s entirely optional.' },
  { q: 'Does it work without internet?', a: 'Once you\'ve opened the app and sounds are cached by the PWA service worker, AmbientFlow works fully offline.' },
  { q: 'How many sounds can I mix at once?', a: 'Up to 6 simultaneous channels — plenty for rich, layered soundscapes without overloading your device.' },
  { q: 'Can I share my mix with others?', a: 'Yes! Hit "Copy Link" in the app to get a URL that encodes your exact mix — volumes included. Anyone who opens it hears your soundscape.' },
  { q: 'Does it work on mobile?', a: 'Fully responsive and installable as a PWA on iOS and Android. Add it to your home screen for a native-app feel.' },
  { q: 'Will there be more sounds added?', a: 'Yes — more sounds are planned. Premium packs with HD nature audio and exotic environments are on the roadmap.' },
]

// ─── Landing page ───────────────────────────────────────────────────────────
export default function Landing() {
  const [navSolid, setNavSolid] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON_LD
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0b0b16', color: '#f1f5f9' }}>

      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div
          className="absolute -top-48 -left-48 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'landing-float 26s ease-in-out infinite' }}
        />
        <div
          className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', animation: 'landing-float 32s ease-in-out 9s infinite reverse' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[320px] h-[320px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animation: 'landing-float 20s ease-in-out 5s infinite' }}
        />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          navSolid
            ? { background: 'rgba(11,11,22,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }
            : { background: 'transparent' }
        }
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="AmbientFlow home">
            <img src="/icons/icon-48.png" alt="AmbientFlow logo" className="w-8 h-8 rounded-lg" />
            <span
              className="text-lg font-bold hidden sm:block"
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AmbientFlow
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition-colors hidden sm:block cursor-pointer">Features</a>
            <a href="#faq" className="text-sm text-slate-400 hover:text-slate-200 transition-colors hidden sm:block cursor-pointer">FAQ</a>
            <Link
              to="/app"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 cursor-pointer hover:brightness-110"
              style={{ background: '#7c3aed' }}
            >
              Open App
            </Link>
          </div>
        </div>
      </nav>

      <main>

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section id="hero" aria-label="Hero" className="relative min-h-screen flex items-center pt-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Text */}
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 mb-6"
                  style={{ animation: 'hero-fade-up 0.6s ease both' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                  Free · Works Offline · No Account Needed
                </div>

                <h1
                  className="text-center lg:text-left text-5xl sm:text-6xl lg:text-[4.25rem] font-bold leading-[1.06] tracking-tight mb-6"
                  style={{ animation: 'hero-fade-up 0.6s ease 0.1s both' }}
                >
                  Your sound environment.{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #60a5fa 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Your rules.
                  </span>
                </h1>

                <p
                  className="w-full text-center lg:text-left text-lg text-slate-400 leading-relaxed lg:w-lg mb-8"
                  style={{ animation: 'hero-fade-up 0.6s ease 0.2s both' }}
                >
                  Mix ambient sounds for focus, sleep, and relaxation. Layer rain, fire, ocean and more with individual volume control — then save or share your perfect mix.
                </p>

                <div
                  className="w-full lg:w-fit flex flex-col lg:flex-row flex-wrap justify-center items-center gap-3"
                  style={{ animation: 'hero-fade-up 0.6s ease 0.3s both' }}
                >
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                  >
                    Start Mixing — Free
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  >
                    See how it works
                  </a>
                </div>
              </div>

              {/* Mixer preview */}
              <div
                className="flex justify-center lg:justify-end"
                style={{ animation: 'hero-fade-up 0.7s ease 0.45s both' }}
              >
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-2xl blur-3xl opacity-40"
                    style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)', transform: 'scale(1.4)' }}
                    aria-hidden
                  />
                  <MixerPreview />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sounds ──────────────────────────────────────────────────────── */}
        <section id="sounds" aria-labelledby="sounds-heading" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-12">
              <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Sound Library</p>
              <h2 id="sounds-heading" className="text-3xl sm:text-4xl font-bold mb-4">
                11 ambient sounds. Infinite combinations.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                From nature to urban, cozy to focus — every sound is independently tunable and stackable with any other.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3" role="list" aria-label="Available sounds">
              {SOUNDS.map(({ Icon, name, category }, i) => {
                const s = CATEGORY_STYLE[category]!
                return (
                  <Reveal key={name} delay={i * 40}>
                    <div
                      className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 cursor-default ${s.bg}`}
                      role="listitem"
                    >
                      <Icon className={`w-6 h-6 ${s.text}`} aria-hidden />
                      <span className="text-sm font-medium text-slate-200 text-center leading-tight">{name}</span>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${s.text}`}>{category}</span>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section id="features" aria-labelledby="features-heading" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-14">
              <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Features</p>
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-4">
                Everything you need. Nothing you don't.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                Built for people who want ambient audio without the bloat — simple tools, deep control.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map(({ Icon, title, desc, accent, glow }, i) => (
                <Reveal key={title} delay={i * 70}>
                  <article className={`min-h-55 p-6 rounded-2xl border bg-white/3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/6 cursor-default ${glow}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${glow}`}>
                      <Icon className={`w-5 h-5 ${accent}`} aria-hidden />
                    </div>
                    <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section id="how-it-works" aria-labelledby="how-heading" className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-16">
              <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">How It Works</p>
              <h2 id="how-heading" className="text-3xl sm:text-4xl font-bold">Three steps to your perfect sound.</h2>
            </Reveal>

            <ol className="space-y-10">
              {STEPS.map(({ n, title, desc }, i) => (
                <Reveal key={n} delay={i * 120} from={i % 2 === 0 ? 'left' : 'right'}>
                  <li className="flex gap-6 items-start">
                    <div className="shrink-0 w-12 h-12 rounded-full border border-violet-500/40 bg-violet-500/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-violet-400 tabular-nums">{n}</span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
                      <p className="text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Use cases ───────────────────────────────────────────────────── */}
        <section id="use-cases" aria-labelledby="use-cases-heading" className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-14">
              <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">Use Cases</p>
              <h2 id="use-cases-heading" className="text-3xl sm:text-4xl font-bold mb-4">Built for every moment.</h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                Pre-built presets get you started in seconds. Custom mixes take you exactly where you need to go.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-3 gap-5">
              {USE_CASES.map(({ Icon, title, desc, gradient, border, accent, iconColor, sounds }, i) => (
                <Reveal key={title} delay={i * 100}>
                  <article className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border ${border} h-full flex flex-col`}>
                    <Icon className={`w-8 h-8 ${iconColor} mb-4`} aria-hidden />
                    <h3 className={`text-xl font-semibold ${accent} mb-2`}>{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sounds.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-xs text-slate-300 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" aria-labelledby="faq-heading" className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-12">
              <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-3">FAQ</p>
              <h2 id="faq-heading" className="text-3xl sm:text-4xl font-bold">Common questions.</h2>
            </Reveal>

            <Reveal>
              <div className="space-y-3" role="list" aria-label="Frequently asked questions">
                {FAQS.map(faq => (
                  <FaqItem key={faq.q} {...faq} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────────── */}
        <section aria-label="Call to action" className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="relative rounded-3xl p-8 sm:p-14 text-center overflow-hidden">
                <div
                  className="absolute inset-0 rounded-3xl border border-violet-500/20"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.15) 100%)' }}
                  aria-hidden
                />
                <div
                  className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
                  aria-hidden
                />
                <div className="relative">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready for better focus?</h2>
                  <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
                    Join thousands of people using AmbientFlow to work, study, and relax with the perfect sound environment — for free.
                  </p>
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:brightness-110 hover:scale-[1.02] cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                  >
                    Start Mixing — It's Free
                    <ArrowRight className="w-5 h-5" aria-hidden />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-4" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-sm">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-48.png" alt="AmbientFlow" className="w-6 h-6 rounded-md" />
            <span className="font-semibold text-slate-300">AmbientFlow</span>
            <span className="text-slate-700">—</span>
            <span className="text-slate-500">Focus deeper. Sleep better.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://ko-fi.com/ambientflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <Coffee className="w-4 h-4" aria-hidden />
              Support on Ko-fi
            </a>
            <span className="text-slate-700">·</span>
            <span className="text-slate-600">© {new Date().getFullYear()} AmbientFlow</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
