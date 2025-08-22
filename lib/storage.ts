export const LS_KEYS = { agents:'acerta.agents.ALL', teams:'acerta.teams.ALL' }
export const load = <T,>(k: string, fb: T)=> { try{ const s = localStorage.getItem(k); return s? JSON.parse(s) as T: fb }catch{ return fb } }
export const save = (k: string, v: unknown)=> { try{ localStorage.setItem(k, JSON.stringify(v)) }catch{} }
