'use client'

import { useState, useEffect } from 'react'
import { saveVote } from './actions'

type Prenom = { id: number; prenom: string; genre: string }
type Filter = 'tous' | 'fille' | 'garcon' | 'mixte'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
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

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'tous', label: '👶 Tous' },
  { key: 'fille', label: '👧 Fille' },
  { key: 'garcon', label: '👦 Garçon' },
  { key: 'mixte', label: '🌈 Mixte' },
]

export default function PrenomsApp({ prenoms }: { prenoms: Prenom[] }) {
  const [filter, setFilter] = useState<Filter>('tous')
  const [queue, setQueue] = useState<Prenom[]>(() => shuffle(prenoms))
  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState<Prenom[]>([])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const filtered = filter === 'tous' ? prenoms : prenoms.filter(p => p.genre === filter)
    setQueue(shuffle(filtered))
    setIndex(0)
    setLiked([])
  }, [filter, prenoms])

  const current = queue[index]
  const done = index >= queue.length

  async function handle(vote: 'like' | 'skip') {
    if (fading) return
    if (vote === 'like') setLiked(prev => [...prev, current])
    saveVote(current.id, vote)
    setFading(true)
    setTimeout(() => {
      setIndex(i => i + 1)
      setFading(false)
    }, 250)
  }

  function restart() {
    setQueue(prev => shuffle(prev))
    setIndex(0)
    setLiked([])
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-md text-center">
        <div>
          <div className="text-7xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold">Vos coups de cœur</h2>
          {liked.length > 0 && (
            <p className="text-gray-500 mt-1">
              {liked.length} prénom{liked.length > 1 ? 's' : ''} aimé{liked.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {liked.length === 0 ? (
          <p className="text-gray-400 italic">Aucun prénom aimé cette fois…</p>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {liked.map(p => (
              <span
                key={p.id}
                className={`bg-gradient-to-br ${GENRE_BG[p.genre]} px-5 py-2 rounded-full font-semibold text-lg shadow-sm`}
              >
                {GENRE_EMOJI[p.genre]} {p.prenom}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={restart}
          className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
        >
          Recommencer
        </button>
      </div>
    )
  }

  const progress = Math.round((index / queue.length) * 100)
  const bg = GENRE_BG[current.genre] ?? 'from-gray-100 to-gray-200'

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap justify-center">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">{index} / {queue.length}</p>
      </div>

      {/* Card */}
      <div
        className={`w-full bg-gradient-to-br ${bg} rounded-3xl p-14 flex flex-col items-center gap-3 shadow-lg transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="text-6xl">{GENRE_EMOJI[current.genre]}</span>
        <h2 className="text-6xl font-bold tracking-tight">{current.prenom}</h2>
        <span className="text-sm text-gray-500">{GENRE_LABEL[current.genre]}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-8 mt-2">
        <button
          onClick={() => handle('skip')}
          disabled={fading}
          title="Passer"
          className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 text-2xl flex items-center justify-center shadow-md hover:border-red-300 hover:bg-red-50 hover:scale-110 transition-all active:scale-95 disabled:opacity-40"
        >
          ✗
        </button>
        <button
          onClick={() => handle('like')}
          disabled={fading}
          title="J'aime"
          className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 text-3xl flex items-center justify-center shadow-md hover:border-pink-300 hover:bg-pink-50 hover:scale-110 transition-all active:scale-95 disabled:opacity-40"
        >
          ❤️
        </button>
        <div className="w-16" />
      </div>

      {liked.length > 0 && (
        <p className="text-sm text-gray-400">{liked.length} favori{liked.length > 1 ? 's' : ''} pour l&apos;instant ✨</p>
      )}
    </div>
  )
}
