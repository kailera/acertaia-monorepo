import { INIT_AGENTS, INIT_TEAMS } from '@/lib/constants'
import type { Agent, Team } from '@/lib/types'

type DB = { agents: Agent[]; teams: Team[] }
const g = globalThis as any

if (!g.__ACERTA_DB__) {
  g.__ACERTA_DB__ = { agents: [...INIT_AGENTS], teams: [...INIT_TEAMS] } as DB
}
export const db: DB = g.__ACERTA_DB__

export const upsertAgent = (a: Agent)=> {
  const i = db.agents.findIndex(x => x.id === a.id)
  i>=0 ? db.agents.splice(i,1,a) : db.agents.unshift(a)
  return a
}
export const deleteAgent = (id: string)=> { db.agents = db.agents.filter(a=>a.id!==id) }

export const upsertTeam = (t: Team)=> {
  const i = db.teams.findIndex(x => x.id === t.id)
  i>=0 ? db.teams.splice(i,1,t) : db.teams.unshift(t)
  return t
}
export const deleteTeam = (id: string)=> { db.teams = db.teams.filter(t=>t.id!==id) }
