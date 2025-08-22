'use client'
import type { Agent, Team } from '@/lib/types'
import { TIPOS, CAT_ICON } from '@/lib/constants'

function TeamCard({team,agents,onChange,onRemove,onDuplicate}:{team:Team;agents:Agent[];onChange:(t:Team)=>void;onRemove:(id:string)=>void;onDuplicate:(t:Team)=>void;}){
  const availableByTipo = TIPOS.map(tipo=>({ tipo, agent: agents.find(a=>a.role!=='Supervisor' && a.tipo===tipo) }))
  function toggleMember(agentId:string){
    const has = team.membros.includes(agentId)
    let membros = has ? team.membros.filter(i=>i!==agentId) : [...team.membros, agentId]
    let prioridade = (team.prioridade||[]).filter(i=> membros.includes(i))
    if(!has && !prioridade.includes(agentId)) prioridade=[...prioridade, agentId]
    const idsSet = new Set(membros)
    const regras = (team.regras||[]).filter(r=> idsSet.has(r.de) && idsSet.has(r.para))
    onChange({...team, membros, prioridade, regras})
  }
  function move(id:string,dir:'up'|'down'){
    const arr=[...(team.prioridade||[])]; const i=arr.indexOf(id); if(i<0) return
    const j=dir==='up'? i-1 : i+1; if(j<0||j>=arr.length) return
    ;[arr[i],arr[j]]=[arr[j],arr[i]]; onChange({...team, prioridade:arr})
  }
  function addRegra(){
    const ids=(team.prioridade && team.prioridade.length)? team.prioridade : team.membros
    if(ids.length<2) return
    const de=ids[0], para=ids[1]
    const regra={id:'rg-'+Math.random().toString(36).slice(2,7), de, para, condicao:''}
    onChange({...team, regras:[...(team.regras||[]), regra]})
  }
  function updRegra(id:string,k:keyof Team['regras'][number],v:any){ onChange({...team, regras:(team.regras||[]).map(r=> r.id===id? {...r,[k]:v}:r)}) }
  function delRegra(id:string){ onChange({...team, regras:(team.regras||[]).filter(r=> r.id!==id)}) }

  return (
    <div className="card p-4">
      <div className="row" style={{gap:10,alignItems:'center'}}>
        <input className="field" value={team.nome} onChange={e=>onChange({...team,nome:e.target.value})} style={{maxWidth:340}}/>
        <span className="spacer"/>
        <button className="btn" onClick={()=>onChange({...team, ativo:!team.ativo})}>{team.ativo? 'Pausar':'Ativar'}</button>
        <button className="btn" onClick={()=>onDuplicate(team)}>Copiar</button>
        <button className="btn" onClick={()=>onRemove(team.id)} style={{color:'#ef4444'}}>Remover</button>
      </div>

      <div className="mt-3">
        <div className="muted" style={{marginBottom:6}}>Seleção de membros</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:8}}>
          {availableByTipo.map(({tipo,agent})=>(
            <button key={tipo} className={`btn ${agent && team.membros.includes(agent.id)?'primary':''}`} onClick={()=> agent && toggleMember(agent.id)} title={agent? agent.nome : 'Nenhum'}>
              <span style={{marginRight:8}}>{CAT_ICON[tipo]||'•'}</span>{tipo} <small className="muted" style={{marginLeft:6}}>{agent? agent.nome : '—'}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="muted" style={{marginBottom:6}}>Prioridade</div>
        <div className="list">
          {(team.prioridade||[]).map(id=>{
            const a=agents.find(x=>x.id===id); if(!a) return null
            return (
              <div key={id} className="row" style={{gap:8,alignItems:'center'}}>
                <span style={{display:'inline-block',width:10,height:10,borderRadius:6,background:a.color}}/>
                <span style={{fontWeight:600}}>{a.nome}</span>
                <span className="spacer"/>
                <button className="btn" onClick={()=>move(id,'up')}>↑</button>
                <button className="btn" onClick={()=>move(id,'down')}>↓</button>
                <button className="btn" onClick={()=>{
                  const prioridade=(team.prioridade||[]).filter(x=>x!==id)
                  onChange({...team, prioridade})
                }} style={{color:'#ef4444'}}>Remover</button>
              </div>
            )
          })}
          {(!team.prioridade || team.prioridade.length===0) && <div className="muted">Adicione membros e defina a ordem.</div>}
        </div>
      </div>

      <div className="mt-3">
        <div className="row" style={{alignItems:'center',gap:8,marginBottom:6}}>
          <div className="muted">Regras (De → Para + condição)</div>
          <span className="spacer"/>
          <button className="btn" onClick={addRegra}>Nova regra</button>
        </div>
        <div className="list">
          {(team.regras||[]).map(r=>{
            const options = team.membros.map(id=> ({id, nome: (agents.find(a=>a.id===id)||{} as any).nome || id}))
            return (
              <div key={r.id} className="row" style={{gap:8}}>
                <select className="field" value={r.de} onChange={e=>updRegra(r.id,'de',e.target.value)}>{options.map(o=> <option key={o.id} value={o.id}>De: {o.nome}</option>)}</select>
                <select className="field" value={r.para} onChange={e=>updRegra(r.id,'para',e.target.value)}>{options.map(o=> <option key={o.id} value={o.id}>Para: {o.nome}</option>)}</select>
                <input className="field" value={r.condicao||''} onChange={e=>updRegra(r.id,'condicao',e.target.value)} placeholder="Condição"/>
                <button className="btn" onClick={()=>delRegra(r.id)} style={{color:'#ef4444'}}>Excluir</button>
              </div>
            )
          })}
          {(!team.regras || team.regras.length===0) && <div className="muted">Nenhuma regra. Clique em “Nova regra”.</div>}
        </div>
      </div>
    </div>
  )
}

export function TeamsView({
  agents, teams, setTeams,
  onPersistTeam, onRemoveTeam, onDuplicateTeam
}:{
  agents:Agent[]; teams:Team[];
  setTeams:(u:(arr:Team[])=>Team[])=>void;
  onPersistTeam?:(t:Team)=>void|Promise<void>;
  onRemoveTeam?:(id:string)=>void|Promise<void>;
  onDuplicateTeam?:(t:Team)=>void|Promise<void>;
}){
  function addTeam(){
    const id='t-'+Math.random().toString(36).slice(2,7)
    const base = agents.filter(a=>a.role!=='Supervisor').slice(0,3).map(a=>a.id)
    const novo: Team = {id, nome:'Novo Time', ativo:true, membros:[...base], prioridade:[...base], regras:[], color:'#7C3AED'}
    setTeams(ts=> [novo, ...ts]); onPersistTeam && onPersistTeam(novo)
  }
  function updTeam(t:Team){ setTeams(ts=> ts.map(x=> x.id===t.id? t: x)); onPersistTeam && onPersistTeam(t) }
  function delTeam(id:string){ setTeams(ts=> ts.filter(x=> x.id!==id)); onRemoveTeam && onRemoveTeam(id) }
  function dupTeam(t:Team){ const copy={...t, id:'t-'+Math.random().toString(36).slice(2,7), nome:t.nome+' (cópia)'}; setTeams(ts=> [copy, ...ts]); onDuplicateTeam && onDuplicateTeam(copy) }

  return (
    <div className="p-4" style={{display:'grid',gap:12}}>
      <div className="row" style={{gap:8,alignItems:'center'}}>
        <div style={{fontWeight:700}}>Times</div>
        <span className="spacer"/>
        <button className="btn primary" onClick={addTeam}>Criar Time</button>
      </div>
      <div style={{display:'grid',gap:12}}>
        {teams.map(t=> <TeamCard key={t.id} team={t} agents={agents} onChange={updTeam} onRemove={delTeam} onDuplicate={dupTeam}/>)}
        {teams.length===0 && <div className="card p-4 muted">Nenhum time criado.</div>}
      </div>
    </div>
  )
}
