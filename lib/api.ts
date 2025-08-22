import type { Agent, Team } from './types'
const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
const url = (p:string)=> `${BASE}${p}`
export async function getAgents(): Promise<Agent[]> {
  const r = await fetch(url('/api/agents'), { cache: 'no-store' }); if(!r.ok) throw new Error(`AGENTS ${r.status}`); return r.json()
}
export async function getTeams(): Promise<Team[]> {
  const r = await fetch(url('/api/teams'),  { cache: 'no-store' }); if(!r.ok) throw new Error(`TEAMS ${r.status}`); return r.json()
}
