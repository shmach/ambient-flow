interface Props {
  soundId: string
  className?: string
}

export function SoundIcon({ soundId, className = 'w-10 h-10' }: Props) {
  const cls = `${className} text-current`
  switch (soundId) {
    case 'rain-light':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 16.5a5 5 0 0 1 .9-9.9 6 6 0 0 1 11.4 2.4A4.5 4.5 0 0 1 17 16.5" />
          <line x1="8" y1="19" x2="7" y2="22" />
          <line x1="12" y1="19" x2="11" y2="22" />
          <line x1="16" y1="19" x2="15" y2="22" />
        </svg>
      )
    case 'rain-heavy':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 15.5a5 5 0 0 1 .9-9.9 6 6 0 0 1 11.4 2.4A4.5 4.5 0 0 1 17 15.5" />
          <line x1="7" y1="18" x2="6" y2="21" />
          <line x1="11" y1="18" x2="10" y2="21" />
          <line x1="15" y1="18" x2="14" y2="21" />
          <line x1="9" y1="20" x2="8" y2="23" />
          <line x1="13" y1="20" x2="12" y2="23" />
        </svg>
      )
    case 'thunderstorm':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 15a5 5 0 0 1 .9-9.9 6 6 0 0 1 11.4 2.4A4.5 4.5 0 0 1 16 15" />
          <polyline points="13 11 10 16 14 16 11 21" />
        </svg>
      )
    case 'ocean-waves':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
          <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
          <path d="M2 7c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
        </svg>
      )
    case 'forest':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 20 18 4 18" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <polygon points="7 10 13 22 1 22" />
          <polygon points="17 10 23 22 11 22" />
        </svg>
      )
    case 'campfire':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
          <path d="M12 8c0 3-2 4.5-2 7a2 2 0 0 0 4 0c0-2.5-2-4-2-7z" />
          <line x1="6" y1="22" x2="18" y2="22" />
          <line x1="8" y1="19" x2="5" y2="22" />
          <line x1="16" y1="19" x2="19" y2="22" />
        </svg>
      )
    case 'fireplace':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 21V9a3 3 0 0 1 6 0v12" />
          <path d="M12 9c0 2-2 3-2 5a2 2 0 0 0 4 0c0-2-2-3-2-5z" />
        </svg>
      )
    case 'coffee-shop':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3c0 2-2 2-2 4a2 2 0 0 0 4 0c0-2-2-2-2-4z" />
          <path d="M12 3c0 2-2 2-2 4a2 2 0 0 0 4 0c0-2-2-2-2-4z" />
          <path d="M4 10h12l-1.5 8H5.5L4 10z" />
          <path d="M16 12h2a2 2 0 0 1 0 4h-2" />
        </svg>
      )
    case 'library':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
          <path d="M2 19h20" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </svg>
      )
    case 'city-night':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="10" width="5" height="12" />
          <rect x="9" y="6" width="6" height="16" />
          <rect x="17" y="8" width="5" height="14" />
          <line x1="4" y1="13" x2="4" y2="13.01" strokeWidth="2" />
          <line x1="12" y1="9" x2="12" y2="9.01" strokeWidth="2" />
          <line x1="19" y1="11" x2="19" y2="11.01" strokeWidth="2" />
          <line x1="0" y1="22" x2="24" y2="22" />
        </svg>
      )
    case 'white-noise':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 12c.7-1.5 1.3-1.5 2 0s1.3 1.5 2 0 1.3-1.5 2 0 1.3 1.5 2 0 1.3-1.5 2 0 1.3 1.5 2 0 1.3-1.5 2 0" />
          <path d="M2 7c1-2 2-2 3 0s2 2 3 0 2-2 3 0 2 2 3 0 2-2 3 0" />
          <path d="M2 17c1-2 2-2 3 0s2 2 3 0 2-2 3 0 2 2 3 0 2-2 3 0" />
        </svg>
      )
    case 'brown-noise':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M2 12c1-3 2-3 3 0s2 3 3 0 2-3 3 0 2 3 3 0 2-3 3 0" />
          <path d="M2 7c1.5-2 2.5-2 3 0 .5 2 1.5 2 3 0s2.5-2 3 0c.5 2 1.5 2 3 0s2.5-2 3 0" />
          <path d="M2 17c1.5-2 2.5-2 3 0 .5 2 1.5 2 3 0s2.5-2 3 0c.5 2 1.5 2 3 0s2.5-2 3 0" />
        </svg>
      )
    case 'fan':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2" />
          <path d="M12 10c0-4-3-7-3-7s-1 4 1 6" />
          <path d="M14 12c4 0 7-3 7-3s-4-1-6 1" />
          <path d="M12 14c0 4 3 7 3 7s1-4-1-6" />
          <path d="M10 12c-4 0-7 3-7 3s4 1 6-1" />
        </svg>
      )
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l3 3" />
        </svg>
      )
  }
}
