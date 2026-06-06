# AmbientFlow

Mixer de sons ambientes totalmente customizável. O usuário combina camadas de áudio (chuva, fogueira, café, natureza, ruído branco) com controle individual de volume por camada, cria e salva presets para sessões de foco ou relaxamento.

Alternativa ao Rainymood e Noisli com mais liberdade criativa.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + Vite 6 |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Áudio | Web Audio API (nativa) |
| Persistência MVP | localStorage |
| Deploy | Vercel (estático) |
| Áudios hospedados | Cloudflare R2 free tier |
| PWA | vite-plugin-pwa (Workbox) |
| Paid tier (futuro) | Supabase (auth + sync de presets) |

## Arquitetura MVP

```
src/
  components/
    SoundChannel.tsx     # controle de volume + play/pause por som
    SoundMixer.tsx       # grid de canais ativos
    SoundPicker.tsx      # modal/drawer para adicionar sons
    PresetBar.tsx        # lista de presets salvos
    PresetSaveModal.tsx  # input de nome e save
  hooks/
    useAudioEngine.ts    # Web Audio API: GainNode + AudioContext por canal
    usePresets.ts        # CRUD em localStorage
  lib/
    sounds.ts            # catálogo de sons com URL e ícone
  store/
    mixer.ts             # estado global com Zustand
  App.tsx
  main.tsx
```

O `AudioContext` é criado uma única vez (singleton). Cada canal de som usa um `GainNode` independente conectado ao `destination`. A reprodução é feita com `AudioBufferSourceNode` em loop. Volume de master e por canal são controlados via `gain.value`.

## Catálogo de Sons (MVP)

| ID | Nome | Categoria |
|---|---|---|
| `rain-light` | Chuva leve | Natureza |
| `rain-heavy` | Chuva forte | Natureza |
| `thunderstorm` | Tempestade | Natureza |
| `ocean-waves` | Ondas do mar | Natureza |
| `forest` | Floresta | Natureza |
| `campfire` | Fogueira | Aconchego |
| `fireplace` | Lareira | Aconchego |
| `coffee-shop` | Cafeteria | Urbano |
| `library` | Biblioteca | Urbano |
| `city-night` | Cidade noturna | Urbano |
| `white-noise` | Ruído branco | Foco |
| `brown-noise` | Ruído marrom | Foco |
| `fan` | Ventilador | Foco |

Arquivos `.mp3` hospedados no Cloudflare R2, carregados via `fetch` e decodificados com `audioContext.decodeAudioData`.

## Roadmap por Feature

### Fase 1 — Fundação
- [x] Scaffold com Vite + React + TypeScript + Tailwind v4
- [x] Configurar PWA manifest (nome, ícones, `display: standalone`)
- [x] Service worker com Workbox para cache offline dos áudios
- [x] CI básico: lint (ESLint) + type-check no push

### Fase 2 — Engine de Áudio
- [x] `useAudioEngine` — criar `AudioContext` singleton
- [x] Carregar áudio via `fetch` + `decodeAudioData` com cache local
- [x] Play / pause / loop por canal (`AudioBufferSourceNode`)
- [x] `GainNode` por canal com controle de volume (0–1)
- [x] `GainNode` master para volume global
- [x] Fade in/out suave ao ligar/desligar um canal (ramp 300ms)

### Fase 3 — UI do Mixer
- [x] `SoundChannel` — card com ícone, nome, slider de volume e botão on/off
- [x] `SoundMixer` — grid responsivo de canais ativos (até 6 simultâneos no MVP)
- [x] `SoundPicker` — drawer com catálogo completo para adicionar canal
- [x] Indicador visual de canal tocando (pulse animation)
- [x] Volume master com slider no header
- [x] Estado vazio amigável ("Adicione um som para começar")

### Fase 4 — Sistema de Presets
- [ ] `usePresets` — `save`, `load`, `delete`, `list` via localStorage
- [ ] `PresetBar` — chips horizontais com presets salvos; clique carrega o preset
- [ ] `PresetSaveModal` — modal com input de nome + botão salvar
- [ ] Preset padrão "Focus" pré-carregado na primeira visita (chuva leve + ruído branco)
- [ ] Preset padrão "Sleep" pré-carregado (ondas do mar + chuva leve)
- [ ] Confirmação antes de deletar preset

### Fase 5 — Compartilhamento por URL
- [ ] Serializar estado do mixer em query string (`?s=rain-light:0.6,campfire:0.4`)
- [ ] Ao abrir URL com query string, restaurar mixer automaticamente
- [ ] Botão "Copiar link do mix" no header

### Fase 6 — Polimento & PWA
- [ ] Layout mobile-first testado em 375px e 390px
- [ ] Dark mode (CSS `prefers-color-scheme`)
- [ ] Ícones SVG para cada categoria de som
- [ ] Animação de "onda" no background sincronizada com os sons ativos
- [ ] Botão de doação Ko-fi/Pix no footer
- [ ] Deploy no Vercel com preview por PR

### Fase 7 — Pós-MVP: Plano Pago (Supabase)
- [ ] Auth com email/Google via Supabase
- [ ] Migrar presets do localStorage para Supabase ao fazer login
- [ ] Sync de presets entre dispositivos
- [ ] Pack de sons premium (natureza HD, instrumentos, ambientes exóticos)
- [ ] Integração Stripe para plano pago mensal

## Regras de Desenvolvimento

- Manter MVP 100% client-side: nenhum fetch para servidor próprio até a Fase 7.
- Áudios são arquivos estáticos; nunca processar áudio no servidor.
- `AudioContext` só pode ser criado após interação do usuário (política dos browsers) — criar no primeiro clique/toque.
- Limite de 6 canais simultâneos no MVP para controle de performance em mobile.
- Presets são objetos `{ id, name, channels: { soundId, volume }[] }` — não alterar este shape sem migrar localStorage.
- Não usar `any` no TypeScript; habilitar `strict: true`.

## Comandos

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm run preview    # preview do build local
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Monetização

- MVP: gratuito, doações via Ko-fi/Pix
- Plano pago: sons premium + sync via Supabase (a implementar na Fase 7)
