'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveVote(prenomId: number, vote: 'like' | 'skip') {
  const supabase = await createClient()
  await supabase.from('ws14_prenoms_votes').insert({ prenom_id: prenomId, vote })
}
