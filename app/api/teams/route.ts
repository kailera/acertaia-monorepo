import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { db, upsertTeam } from '../_utils/store'
import { withCORS, options } from '../_utils/cors'

export async function GET(){ noStore(); return withCORS(NextResponse.json(db.teams)) }
export async function POST(req: Request){
  noStore()
  const t = await req.json()
  if(!t?.id) return withCORS(NextResponse.json({error:'missing id'},{status:400}))
  return withCORS(NextResponse.json(upsertTeam(t)))
}
export const OPTIONS = options
