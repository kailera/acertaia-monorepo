'use client'
import type { Agent, Team } from '@/lib/types'
import { Topbar } from './Topbar'
import { AgentsList } from './AgentsList'
import ModalAgent from './ModalAgent'
import { TeamsView } from './Teams'
import { useState } from 'react'
import { CAT_BG } from '@/lib/constants'

const A_URL = '/api/agents'; const T_URL = '/api/teams'
async function postJSON(url:string, body:any){ await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}) }
async function del(url:string){ await fetch(url,{method:'DELETE'}) }

export default function HomeRSC({ initialAgents, initialTeams }:{ initialAgents:Agent[]; initialTeams:Team[] }){
  const [route,setRoute]=useState('/agentes/lista')
  const [search,setSearch]=useState('')
  const [agents,setAgents]=useState(initialAgents)
  const [teams,setTeams]=useState(initialTeams)
  const [modalOpen,setModalOpen]=useState(false)
  const [editId,setEditId]=useState<string|null>(null)

  function newAgent(){ setEditId(null); setModalOpen(true) }
  async function saveAgent(f: Agent){
    if (editId) { const updated={...f,id:editId}; setAgents(a=>a.map(x=>x.id===editId?updated:x)); try{ await postJSON(A_URL,updated) }catch{} }
    else { const id='a'+Math.random().toString(36).slice(2,7); const created={...f,id}; setAgents(a=>[created,...a]); try{ await postJSON(A_URL,created) }catch{} }
  }
  async function delAgent(id:string){ setAgents(a=>a.filter(x=>x.id!==id)); try{ await del(`${A_URL}/${id}`) }catch{} }
  async function toggleAgent(id:string){ const a=agents.find(x=>x.id===id); if(!a) return; const next={...a,status:a.status==='PAUSADO'?'ATIVO':'PAUSADO'}; setAgents(arr=>arr.map(x=>x.id===id?next:x)); try{ await postJSON(A_URL,next) }catch{} }
  async function dupAgent(id:string){ const a=agents.find(x=>x.id===id); if(!a) return; const copy={...a,id:'a'+Math.random().toString(36).slice(2,7),nome:a.nome+' (cópia)',status:'RASCUNHO' as const}; setAgents(arr=>[copy,...arr]); try{ await postJSON(A_URL,copy) }catch{} }
  function editAgent(id:string){ setEditId(id); setModalOpen(true) }
  function trainAgent(id:string){ alert('Treino (mock) '+(agents.find(a=>a.id===id)?.nome||id)) }

  async function persistTeam(t: Team){ setTeams(ts=> ts.map(x=>x.id===t.id? t: x)); try{ await postJSON(T_URL,t) }catch{} }
  async function removeTeam(id:string){ setTeams(ts=> ts.filter(x=> x.id!==id)); try{ await del(`${T_URL}/${id}`) }catch{} }
  async function duplicateTeam(t: Team){ const copy={...t,id:'t-'+Math.random().toString(36).slice(2,7),nome:t.nome+' (cópia)'}; setTeams(ts=>[copy,...ts]); try{ await postJSON(T_URL,copy) }catch{} }

  return (
    <div style={{minHeight:'100vh', backgroundImage:`linear-gradient(0deg, rgba(14,15,18,.18), rgba(14,15,18,.18)), url("${CAT_BG}")`, backgroundSize:'cover', backgroundPosition:'center'}}>
      <Topbar route={route} setRoute={setRoute} search={search} setSearch={setSearch}/>
      {route==='/agentes/lista' && <AgentsList items={agents} query={search} setQuery={setSearch} onNew={newAgent} onToggle={toggleAgent} onDup={dupAgent} onDel={delAgent} onEdit={editAgent} onTrain={trainAgent}/>}
      {route==='/times' && <TeamsView agents={agents} teams={teams} setTeams={(fn)=>setTeams(fn)} onPersistTeam={persistTeam} onRemoveTeam={removeTeam} onDuplicateTeam={duplicateTeam}/>}
      <ModalAgent open={modalOpen} onClose={()=>setModalOpen(false)} onSave={saveAgent} initial={editId? agents.find(a=>a.id===editId)||null : null}/>
    </div>
  )
}
