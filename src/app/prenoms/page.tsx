import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import PrenomsApp from './PrenomsApp'

export const dynamic = 'force-dynamic'

export default async function PrenomsPage() {
  const supabase = await createClient()
  const { data: prenoms } = await supabase
    .from('ws14_prenoms')
    .select('id, prenom, genre')
    .order('prenom')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <Link href="/" className="absolute top-4 left-4 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        ← Accueil
      </Link>

      <div className="text-center">
        <h1 className="text-3xl font-bold">Quel prénom pour votre bébé ?</h1>
        <p className="text-gray-500 mt-1">Aimez ou passez, retrouvez vos favoris à la fin !</p>
      </div>

      <PrenomsApp prenoms={prenoms ?? []} />
    </main>
  )
}
