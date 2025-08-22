import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { db, deleteTeam, upsertTeam } from '../../_utils/store'
import { withCORS, options } from '../../_utils/cors'

export async function GET(_:Request,{params}:{params:{id:string}}){
  noStore(); const t=db.teams.find(x=>x.id===params.id)
  return withCORS(t? NextResponse.json(t) : NextResponse.json({error:'not found'},{status:404}))
}
export async function PUT(req:Request,{params}:{params:{id:string}}){
  noStore(); const body=await req.json(); if(!body?.id) body.id=params.id
  return withCORS(NextResponse.json(upsertTeam(body)))
}
export async function DELETE(_:Request,{params}:{params:{id:string}}){
  noStore(); deleteTeam(params.id); return withCORS(NextResponse.json({ok:true}))
}
export const OPTIONS = options
