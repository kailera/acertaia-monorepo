'use client'
import type { Agent } from '@/lib/types'

export function AgentsList({
  items, query, setQuery,
  onNew, onToggle, onDup, onDel, onEdit, onTrain
}:{
  items:Agent[]; query:string; setQuery:(s:string)=>void;
  onNew:()=>void; onToggle:(id:string)=>void; onDup:(id:string)=>void; onDel:(id:string)=>void; onEdit:(id:string)=>void; onTrain:(id:string)=>void;
}){
  const view = items
    .filter(a=> a.role!=='Supervisor')
    .filter(a=> a.nome.toLowerCase().includes(query.toLowerCase()) || (a.persona||'').toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="p-4">
      <div className="row" style={{gap:8,alignItems:'center',marginBottom:10}}>
        <input className="field" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar…" style={{maxWidth:260}}/>
        <span className="spacer"/>
        <button className="btn primary" onClick={onNew}>Novo agente</button>
      </div>
      <div className="list">
        {view.map(a=>(
          <div key={a.id} className="rowcard">
            <div className="col" style={{gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                <span style={{display:'inline-block',width:10,height:10,borderRadius:6,background:a.color}}/>
                <div style={{fontWeight:700}}>{a.nome}</div>
                <span className="muted" style={{fontSize:12}}>Tipo: {a.tipo}</span>
                <span className="muted" style={{fontSize:12}}>Canais: {a.canais.join(', ')||'—'}</span>
              </div>
              <div className="muted" style={{fontSize:12}}>Persona: {a.persona || '—'}</div>
            </div>
            <div className="col" style={{gap:10}}>
              <div className="muted" style={{fontSize:12}}>Status: {a.status}</div>
            </div>
            <div className="actions">
              <button className="btn" onClick={()=>onToggle(a.id)}>{a.status==='PAUSADO'?'Ativar':'Pausar'}</button>
              <button className="btn" onClick={()=>onDup(a.id)}>Duplicar</button>
              <button className="btn" onClick={()=>onEdit(a.id)}>Editar</button>
              <button className="btn" onClick={()=>onDel(a.id)} style={{color:'#ef4444'}}>Remover</button>
              <button className="btn" onClick={()=>onTrain(a.id)}>Treinar</button>
            </div>
          </div>
        ))}
        {view.length===0 && <div className="card" style={{padding:18,textAlign:'center'}}><div className="muted">Nenhum agente encontrado.</div></div>}
      </div>
    </div>
  )
}
