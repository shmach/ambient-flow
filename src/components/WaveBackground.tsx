interface Props {
  active: boolean
  intensity: number // 0–1, based on number of playing channels / max channels
}

export function WaveBackground({ active, intensity }: Props) {
  const opacity = active ? 0.12 + intensity * 0.18 : 0

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-1000"
      style={{ opacity }}
      aria-hidden
    >
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path className="wave-path wave-1" fill="url(#wg1)"
          d="M0,160 C360,240 720,80 1080,160 C1260,200 1380,140 1440,160 L1440,320 L0,320 Z"
        />
        <path className="wave-path wave-2" fill="url(#wg2)"
          d="M0,200 C240,160 480,240 720,200 C960,160 1200,240 1440,200 L1440,320 L0,320 Z"
        />
        <path className="wave-path wave-3" fill="url(#wg3)"
          d="M0,240 C180,220 360,260 540,240 C720,220 900,260 1080,240 C1260,220 1380,260 1440,240 L1440,320 L0,320 Z"
        />
        <defs>
          <linearGradient id="wg1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="wg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="wg3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>

      {/* Radial glow at top */}
      <div
        className="absolute inset-x-0 top-0 h-96 wave-glow"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.35) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
