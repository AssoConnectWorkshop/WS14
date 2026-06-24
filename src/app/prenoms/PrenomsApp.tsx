'use client'

import { useState, useEffect } from 'react'
import { saveVote } from './actions'

type Prenom = { id: number; prenom: string; genre: string }
type AppPhase = 'swipe' | 'duel' | 'podium'
type SwipeFilter = 'tous' | 'fille' | 'garcon' | 'mixte'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makePairs(names: Prenom[]): { pairs: [Prenom, Prenom][]; byes: Prenom[] } {
  const pairs: [Prenom, Prenom][] = []
  const byes: Prenom[] = []
  for (let i = 0; i < names.length; i += 2) {
    if (i + 1 < names.length) pairs.push([names[i], names[i + 1]])
    else byes.push(names[i])
  }
  return { pairs, byes }
}

const GENRE_BG: Record<string, string> = {
  fille: 'from-pink-100 to-rose-200',
  garcon: 'from-blue-100 to-sky-200',
  mixte: 'from-purple-100 to-violet-200',
}

const GENRE_EMOJI: Record<string, string> = {
  fille: '👧',
  garcon: '👦',
  mixte: '👶',
}

const GENRE_LABEL: Record<string, string> = {
  fille: 'Fille',
  garcon: 'Garçon',
  mixte: 'Mixte',
}

const SWIPE_FILTERS: { key: SwipeFilter; label: string }[] = [
  { key: 'tous', label: '👶 Tous' },
  { key: 'fille', label: '👧 Fille' },
  { key: 'garcon', label: '👦 Garçon' },
  { key: 'mixte', label: '🌈 Mixte' },
]

const MEDALS = ['🥇', '🥈', '🥉']

export default function PrenomsApp({ prenoms }: { prenoms: Prenom[] }) {
  const [phase, setPhase] = useState<AppPhase>('swipe')

  // Phase 1
  const [filter, setFilter] = useState<SwipeFilter>('tous')
  const [queue, setQueue] = useState<Prenom[]>(() => shuffle(prenoms))
  const [swipeIndex, setSwipeIndex] = useState(0)
  const [liked, setLiked] = useState<Prenom[]>([])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const filtered = filter === 'tous' ? prenoms : prenoms.filter(p => p.genre === filter)
    setQueue(shuffle(filtered))
    setSwipeIndex(0)
    setLiked([])
  }, [filter, prenoms])

  // Phase 2
  const [duelPairs, setDuelPairs] = useState<[Prenom, Prenom][]>([])
  const [duelByes, setDuelByes] = useState<Prenom[]>([])
  const [duelIndex, setDuelIndex] = useState(0)
  const [duelWinners, setDuelWinners] = useState<Prenom[]>([])
  const [duelRound, setDuelRound] = useState(1)
  const [duelFading, setDuelFading] = useState(false)

  // Phase 3
  const [finalists, setFinalists] = useState<Prenom[]>([])

  function startDuels(names: Prenom[]) {
    const { pairs, byes } = makePairs(shuffle(names))
    setDuelPairs(pairs)
    setDuelByes(byes)
    setDuelIndex(0)
    setDuelWinners([])
    setDuelRound(1)
    setPhase('duel')
  }

  function handleDuelPick(winner: Prenom) {
    if (duelFading) return
    setDuelFading(true)
    setTimeout(() => {
      setDuelFading(false)
      const newWinners = [...duelWinners, winner]
      const nextIndex = duelIndex + 1
      if (nextIndex < duelPairs.length) {
        setDuelWinners(newWinners)
        setDuelIndex(nextIndex)
      } else {
        const surviving = [...newWinners, ...duelByes]
        if (surviving.length <= 3) {
          setFinalists(surviving)
          setPhase('podium')
        } else {
          const { pairs, byes } = makePairs(shuffle(surviving))
          setDuelPairs(pairs)
          setDuelByes(byes)
          setDuelIndex(0)
          setDuelWinners([])
          setDuelRound(r => r + 1)
        }
      }
    }, 250)
  }

  function handleSwipe(vote: 'like' | 'skip') {
    if (fading) return
    const current = queue[swipeIndex]
    if (vote === 'like') setLiked(prev => [...prev, current])
    saveVote(current.id, vote)
    setFading(true)
    setTimeout(() => {
      setSwipeIndex(i => i + 1)
      setFading(false)
    }, 250)
  }

  function restart() {
    setPhase('swipe')
    setSwipeIndex(0)
    setLiked([])
    setQueue(shuffle(prenoms))
    setFilter('tous')
  }

  // --- Phase 3: Podium ---
  if (phase === 'podium') {
    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-md text-center">
        <div>
          <div className="text-6xl mb-2">🏆</div>
          <h2 className="text-2xl font-bold">Le podium</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {finalists.length === 1 ? 'Votre grand gagnant !' : `Vos ${finalists.length} finalistes`}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {finalists.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 bg-gradient-to-r ${GENRE_BG[p.genre]} rounded-2xl p-5 shadow-sm`}
            >
              <span className="text-4xl">{MEDALS[i] ?? '✨'}</span>
              <span className="text-3xl">{GENRE_EMOJI[p.genre]}</span>
              <div className="text-left">
                <p className="text-2xl font-bold">{p.prenom}</p>
                <p className="text-xs text-gray-500">{GENRE_LABEL[p.genre]}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={restart}
          className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
        >
          Recommencer depuis le début
        </button>
      </div>
    )
  }

  // --- Phase 2: Duel ---
  if (phase === 'duel') {
    const pair = duelPairs[duelIndex]
    if (!pair) return null
    const progress = Math.round((duelIndex / duelPairs.length) * 100)

    return (
      <div className="flex flex-col items-center gap-5 w-full max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Round {duelRound} — Duel {duelIndex + 1}/{duelPairs.length}
          </p>
          <h2 className="text-xl font-bold mt-1">Lequel préférez-vous ?</h2>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div
          className={`flex gap-4 w-full transition-opacity duration-200 ${duelFading ? 'opacity-0' : 'opacity-100'}`}
        >
          {pair.map((prenom) => (
            <button
              key={prenom.id}
              onClick={() => handleDuelPick(prenom)}
              disabled={duelFading}
              className={`flex-1 bg-gradient-to-br ${GENRE_BG[prenom.genre]} rounded-3xl p-8 flex flex-col items-center gap-2 shadow-md hover:scale-105 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 border-2 border-transparent hover:border-black/10`}
            >
              <span className="text-4xl">{GENRE_EMOJI[prenom.genre]}</span>
              <span className="text-3xl font-bold">{prenom.prenom}</span>
              <span className="text-xs text-gray-500">{GENRE_LABEL[prenom.genre]}</span>
            </button>
          ))}
        </div>

        {duelByes.length > 0 && (
          <p className="text-xs text-gray-400">
            {duelByes.length} prénom{duelByes.length > 1 ? 's' : ''} qualifié{duelByes.length > 1 ? 's' : ''} d&apos;office
          </p>
        )}
      </div>
    )
  }

  // --- Phase 1: Swipe ---
  const swipeDone = swipeIndex >= queue.length

  if (swipeDone) {
    if (liked.length === 0) {
      return (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-6xl">😅</div>
          <h2 className="text-xl font-bold">Aucun prénom aimé…</h2>
          <p className="text-gray-500">Essayez un autre filtre ou recommencez !</p>
          <button
            onClick={restart}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold"
          >
            Recommencer
          </button>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-sm text-center">
        <div className="text-5xl">❤️</div>
        <div>
          <h2 className="text-2xl font-bold">
            {liked.length} prénom{liked.length > 1 ? 's' : ''} aimé{liked.length > 1 ? 's' : ''}
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            {liked.length <= 3
              ? 'Place au podium directement !'
              : 'Place aux duels pour trouver votre favori !'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {liked.map(p => (
            <span
              key={p.id}
              className={`bg-gradient-to-br ${GENRE_BG[p.genre]} px-3 py-1 rounded-full text-sm font-medium`}
            >
              {GENRE_EMOJI[p.genre]} {p.prenom}
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            if (liked.length <= 3) {
              setFinalists(liked)
              setPhase('podium')
            } else {
              startDuels(liked)
            }
          }}
          className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors w-full"
        >
          {liked.length <= 3 ? '🏆 Voir le podium' : '⚔️ Commencer les duels'}
        </button>
      </div>
    )
  }

  const current = queue[swipeIndex]
  const progress = Math.round((swipeIndex / queue.length) * 100)
  const bg = GENRE_BG[current.genre] ?? 'from-gray-100 to-gray-200'

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        {SWIPE_FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="w-full">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">{swipeIndex} / {queue.length}</p>
      </div>

      <div
        className={`w-full bg-gradient-to-br ${bg} rounded-3xl p-14 flex flex-col items-center gap-3 shadow-lg transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="text-6xl">{GENRE_EMOJI[current.genre]}</span>
        <h2 className="text-6xl font-bold tracking-tight">{current.prenom}</h2>
        <span className="text-sm text-gray-500">{GENRE_LABEL[current.genre]}</span>
      </div>

      <div className="flex items-center gap-8 mt-2">
        <button
          onClick={() => handleSwipe('skip')}
          disabled={fading}
          className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 text-2xl flex items-center justify-center shadow-md hover:border-red-300 hover:bg-red-50 hover:scale-110 transition-all active:scale-95 disabled:opacity-40"
        >
          ✗
        </button>
        <button
          onClick={() => handleSwipe('like')}
          disabled={fading}
          className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 text-3xl flex items-center justify-center shadow-md hover:border-pink-300 hover:bg-pink-50 hover:scale-110 transition-all active:scale-95 disabled:opacity-40"
        >
          ❤️
        </button>
        <div className="w-16" />
      </div>

      {liked.length > 0 && (
        <p className="text-sm text-gray-400">{liked.length} favori{liked.length > 1 ? 's' : ''} ✨</p>
      )}
    </div>
  )
}
