export type SoundCategory = 'Natureza' | 'Aconchego' | 'Urbano' | 'Foco'

export interface Sound {
  id: string
  name: string
  category: SoundCategory
  url: string
  emoji: string
}

const BASE_URL =
  (import.meta.env['VITE_SOUNDS_BASE_URL'] as string | undefined) ??
  'https://cdn.ambientflow.app/sounds'

export const SOUNDS: Sound[] = [
  { id: 'rain-light',   name: 'Chuva leve',      category: 'Natureza',  emoji: '🌧️', url: `${BASE_URL}/rain-light.mp3`   },
  { id: 'rain-heavy',   name: 'Chuva forte',      category: 'Natureza',  emoji: '⛈️', url: `${BASE_URL}/rain-heavy.mp3`   },
  { id: 'thunderstorm', name: 'Tempestade',        category: 'Natureza',  emoji: '🌩️', url: `${BASE_URL}/thunderstorm.mp3` },
  { id: 'ocean-waves',  name: 'Ondas do mar',      category: 'Natureza',  emoji: '🌊', url: `${BASE_URL}/ocean-waves.mp3`  },
  { id: 'forest',       name: 'Floresta',          category: 'Natureza',  emoji: '🌲', url: `${BASE_URL}/forest.mp3`       },
  { id: 'campfire',     name: 'Fogueira',          category: 'Aconchego', emoji: '🔥', url: `${BASE_URL}/campfire.mp3`     },
  { id: 'fireplace',    name: 'Lareira',           category: 'Aconchego', emoji: '🪵', url: `${BASE_URL}/fireplace.mp3`    },
  { id: 'coffee-shop',  name: 'Cafeteria',         category: 'Urbano',    emoji: '☕', url: `${BASE_URL}/coffee-shop.mp3`  },
  { id: 'library',      name: 'Biblioteca',        category: 'Urbano',    emoji: '📚', url: `${BASE_URL}/library.mp3`      },
  { id: 'city-night',   name: 'Cidade noturna',    category: 'Urbano',    emoji: '🌃', url: `${BASE_URL}/city-night.mp3`   },
  { id: 'white-noise',  name: 'Ruído branco',      category: 'Foco',      emoji: '📶', url: `${BASE_URL}/white-noise.mp3`  },
  { id: 'brown-noise',  name: 'Ruído marrom',      category: 'Foco',      emoji: '🟤', url: `${BASE_URL}/brown-noise.mp3`  },
  { id: 'fan',          name: 'Ventilador',        category: 'Foco',      emoji: '💨', url: `${BASE_URL}/fan.mp3`          },
]

export const SOUNDS_BY_ID: Readonly<Record<string, Sound>> = Object.fromEntries(
  SOUNDS.map(s => [s.id, s]),
)
