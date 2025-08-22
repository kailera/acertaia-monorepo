import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { db, deleteAgent, upsertAgent } from '../../_utils/store'
import { withCORS, options } from '../../_utils/cors'

export async function GET(_:Request,{params}:{params:{id:string}}){
  noStore(); const a=db.agents.find(x=>x.id===params.id)
  return withCORS(a? NextResponse.json(a) : NextResponse.json({error:'not found'},{status:404}))
}
export async function PUT(req:Request,{params}:{params:{id:string}}){
  noStore(); const body=await req.json(); if(!body?.id) body.id=params.id
  return withCORS(NextResponse.json(upsertAgent(body)))
}
export async function DELETE(_:Request,{params}:{params:{id:string}}){
  noStore(); deleteAgent(params.id); return withCORS(NextResponse.json({ok:true}))
}
export const OPTIONS = options
