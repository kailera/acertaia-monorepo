'use client'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import type { Agent, Team } from '@/lib/types'
import { Topbar } from './Topbar'
import { AgentsList } from './AgentsList'
import ModalAgent from './ModalAgent'
import { TeamsView } from './Teams'
import { useState } from 'react'
import { CAT_BG } from '@/lib/constants'

const A_URL = '/api/agents'
const T_URL = '/api/teams'
async function postJSON(url:string, body:any){ await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}) }
async function del(url:string){ await fetch(url,{method:'DELETE'}) }

export default function HomeSWR(){
  const [route,setRoute]=useState('/agentes/lista')
  const [search,setSearch]=useState('')
  const [modalOpen,setModalOpen]=useState(false)
  const [editAgentId,setEditAgentId]=useState<string|null>(null)

  const { data:agents, mutate:mutAgents, isLoading:loadingA } = useSWR<Agent[]>(A_URL, fetcher)
  const { data:teams, mutate:mutTeams, isLoading:loadingT } = useSWR<Team[]>(T_URL, fetcher)

  function newAgent(){ setEditAgentId(null); setModalOpen(true) }
  async function saveAgent(f: Agent){
    if (editAgentId) {
      const updated={...f,id:editAgentId}
      mutAgents(curr=> curr? curr.map(a=>a.id===editAgentId? updated:a):[], { revalidate:false })
      try{ await postJSON(A_URL, updated); mutAgents() }catch{ mutAgents() }
    } else {
      const id='a'+Math.random().toString(36).slice(2,7)
      const created={...f,id}
      mutAgents(curr=> curr? [created, ...curr]:[created], { revalidate:false })
      try{ await postJSON(A_URL, created); mutAgents() }catch{ mutAgents() }
    }
  }
  async function delAgent(id:string){
    mutAgents(curr=> curr? curr.filter(a=>a.id!==id):[], { revalidate:false })
    try{ await del(`${A_URL}/${id}`); mutAgents() }catch{ mutAgents() }
  }
  async function toggleAgent(id:string){
    const a = agents?.find(x=>x.id===id); if(!a) return
    const next = {...a, status: a.status==='PAUSADO'?'ATIVO':'PAUSADO'}
    mutAgents(curr=> curr? curr.map(x=>x.id===id? next:x):[], { revalidate:false })
    try{ await postJSON(A_URL, next); mutAgents() }catch{ mutAgents() }
  }
  async function dupAgent(id:string){
    const a=agents?.find(x=>x.id===id); if(!a) return
    const copy={...a,id:'a'+Math.random().toString(36).slice(2,7),nome:a.nome+' (cópia)',status:'RASCUNHO' as const}
    mutAgents(curr=> curr? [copy, ...curr]:[copy], { revalidate:false })
    try{ await postJSON(A_URL, copy); mutAgents() }catch{ mutAgents() }
  }
  function editAgent(id:string){ setEditAgentId(id); setModalOpen(true) }
  function trainAgent(id:string){ alert('Treino disparado (mock) para '+(agents?.find(a=>a.id===id)?.nome || id)) }

  async function persistTeam(t: Team){ mutTeams(curr=> curr? curr.map(x=> x.id===t.id? t: x):[], { revalidate:false }); try{ await postJSON(T_URL, t); mutTeams() }catch{ mutTeams() } }
  async function removeTeam(id:string){ mutTeams(curr=> curr? curr.filter(x=>x.id!==id):[], { revalidate:false }); try{ await del(`${T_URL}/${id}`); mutTeams() }catch{ mutTeams() } }
  async function duplicateTeam(t: Team){ const copy={...t, id:'t-'+Math.random().toString(36).slice(2,7), nome:t.nome+' (cópia)'}; mutTeams(curr=> curr? [copy, ...curr]:[copy], { revalidate:false }); try{ await postJSON(T_URL, copy); mutTeams() }catch{ mutTeams() } }

  return (
    <div style={{minHeight:'100vh', backgroundImage:`linear-gradient(0deg, rgba(14,15,18,.18), rgba(14,15,18,.18)), url("${CAT_BG}")`, backgroundSize:'cover', backgroundPosition:'center'}}>
      <Topbar route={route} setRoute={setRoute} search={search} setSearch={setSearch}/>

      {route==='/agentes/lista' && (
        loadingA ? <div className="card p-4">Carregando…</div> :
        <AgentsList
          items={agents||[]}
          query={search}
          setQuery={setSearch}
          onNew={newAgent}
          onToggle={toggleAgent}
          onDup={dupAgent}
          onDel={delAgent}
          onEdit={editAgentId? setEditAgentId as any: (id:string)=>setEditAgentId(id)}
          onTrain={trainAgent}
        />
      )}

      {route==='/times' && (
        loadingT ? <div className="card p-4">Carregando…</div> :
        <TeamsView
          agents={agents||[]}
          teams={teams||[]}
          setTeams={(fn)=>{ const next = fn(teams||[]); mutTeams(next,{revalidate:false}) }}
          onPersistTeam={persistTeam}
          onRemoveTeam={removeTeam}
          onDuplicateTeam={duplicateTeam}
        />
      )}

      <ModalAgent open={modalOpen} onClose={()=>setModalOpen(false)} onSave={saveAgent} initial={editAgentId? (agents||[]).find(a=>a.id===editAgentId)||null : null}/>
    </div>
  )
}
