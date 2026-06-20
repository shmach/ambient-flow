export type SoundCategory = 'Natureza' | 'Aconchego' | 'Urbano' | 'Foco'

export interface Sound {
  id: string
  name: string
  category: SoundCategory
  url: string
  emoji: string
}

const BASE_URL = (import.meta.env['VITE_SOUNDS_BASE_URL'] as string | undefined)

if (!BASE_URL) {
  throw Error("ERROR: Not possible to load env variables");
}

export const SOUNDS: Sound[] = [
  { id: 'rain-light', name: 'Chuva leve', category: 'Natureza', emoji: '🌧️', url: `${BASE_URL}/gentle-rain-3-hours.mp3` },
  { id: 'rain-heavy', name: 'Chuva forte', category: 'Natureza', emoji: '⛈️', url: `${BASE_URL}/heavy-rain-3-hours.mp3` },
  { id: 'thunderstorm', name: 'Tempestade', category: 'Natureza', emoji: '🌩️', url: `${BASE_URL}/thunderstorm.mp3` },
  { id: 'ocean-waves', name: 'Ondas do mar', category: 'Natureza', emoji: '🌊', url: `${BASE_URL}/ocean-waves-40-minutes.mp3` },
  { id: 'forest', name: 'Floresta', category: 'Natureza', emoji: '🌲', url: `${BASE_URL}/forest-3-hour.mp3` },
  { id: 'campfire', name: 'Fogueira', category: 'Aconchego', emoji: '🔥', url: `${BASE_URL}/firecamp-1-hour.mp3` },
  { id: 'fireplace', name: 'Lareira', category: 'Aconchego', emoji: '🪵', url: `${BASE_URL}/fireplace-3-hour.mp3` },
  { id: 'library', name: 'Biblioteca', category: 'Urbano', emoji: '📚', url: `${BASE_URL}/library-3-hour.mp3` },
  { id: 'city-night', name: 'Cidade noturna', category: 'Urbano', emoji: '🌃', url: `${BASE_URL}/city-3-hour.mp3` },
  { id: 'white-noise', name: 'Ruído branco', category: 'Foco', emoji: '📶', url: `${BASE_URL}/white-noise-3-hour.mp3` },
  { id: 'brown-noise', name: 'Ruído marrom', category: 'Foco', emoji: '🟤', url: `${BASE_URL}/brown-noise-3-hour.mp3` },
]

export const SOUNDS_BY_ID: Readonly<Record<string, Sound>> = Object.fromEntries(
  SOUNDS.map(s => [s.id, s]),
)
