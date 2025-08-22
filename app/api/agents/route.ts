import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { db, upsertAgent } from '../_utils/store'
import { withCORS, options } from '../_utils/cors'

export async function GET(){ noStore(); return withCORS(NextResponse.json(db.agents)) }
export async function POST(req: Request){
  noStore()
  const a = await req.json()
  if(!a?.id) return withCORS(NextResponse.json({error:'missing id'},{status:400}))
  return withCORS(NextResponse.json(upsertAgent(a)))
}
export const OPTIONS = options
