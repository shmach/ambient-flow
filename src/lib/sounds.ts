export type SoundCategory = 'Nature' | 'Cozy' | 'Urban' | 'Focus'

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
  { id: 'rain-light', name: 'Light Rain', category: 'Nature', emoji: '🌧️', url: `${BASE_URL}/gentle-rain-3-hours.mp3` },
  { id: 'rain-heavy', name: 'Heavy Rain', category: 'Nature', emoji: '⛈️', url: `${BASE_URL}/heavy-rain-3-hours.mp3` },
  { id: 'thunderstorm', name: 'Thunderstorm', category: 'Nature', emoji: '🌩️', url: `${BASE_URL}/thunderstorm.mp3` },
  { id: 'ocean-waves', name: 'Ocean Waves', category: 'Nature', emoji: '🌊', url: `${BASE_URL}/ocean-waves-40-minutes.mp3` },
  { id: 'forest', name: 'Forest', category: 'Nature', emoji: '🌲', url: `${BASE_URL}/forest-3-hour.mp3` },
  { id: 'campfire', name: 'Campfire', category: 'Cozy', emoji: '🔥', url: `${BASE_URL}/firecamp-1-hour.mp3` },
  { id: 'fireplace', name: 'Fireplace', category: 'Cozy', emoji: '🪵', url: `${BASE_URL}/fireplace-3-hour.mp3` },
  { id: 'library', name: 'Library', category: 'Urban', emoji: '📚', url: `${BASE_URL}/library-3-hour.mp3` },
  { id: 'city-night', name: 'City at Night', category: 'Urban', emoji: '🌃', url: `${BASE_URL}/city-3-hour.mp3` },
  { id: 'white-noise', name: 'White Noise', category: 'Focus', emoji: '📶', url: `${BASE_URL}/white-noise-3-hour.mp3` },
  { id: 'brown-noise', name: 'Brown Noise', category: 'Focus', emoji: '🟤', url: `${BASE_URL}/brown-noise-3-hour.mp3` },
]

export const SOUNDS_BY_ID: Readonly<Record<string, Sound>> = Object.fromEntries(
  SOUNDS.map(s => [s.id, s]),
)
