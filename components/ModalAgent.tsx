'use client'
import { useEffect, useState } from 'react'
import type { Agent } from '@/lib/types'
const MAX = 6000

export default function ModalAgent({open,onClose,onSave,initial}:{open:boolean;onClose:()=>void;onSave:(a:Agent)=>void;initial:Agent|null;}){
  const base: Agent = { id:'', nome:'', tipo:'Vendedor', role:'Agente', canais:['WhatsApp'], status:'RASCUNHO' }
  const [form,setForm]=useState<Agent>(initial||base)
  useEffect(()=> setForm(initial||base),[initial,open])
  if(!open) return null
  const ok = form.nome.trim().length>=3 && (form.instrucaoSDR||'').length<=MAX

  function toggleCanal(c:string){
    const has=(form.canais||[]).includes(c)
    setForm({...form, canais: has? form.canais.filter(x=>x!==c) : [...(form.canais||[]),c]})
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'grid',placeItems:'center',zIndex:50}} onClick={onClose}>
      <div className="card p-4" style={{width:'min(900px,94vw)'}} onClick={e=>e.stopPropagation()}>
        <div className="row" style={{alignItems:'center',gap:8}}>
          <div style={{fontWeight:700}}>{initial? 'Editar agente' : 'Novo agente'}</div>
          <span className="spacer"/>
          <button className="btn" onClick={onClose}>Fechar</button>
        </div>
        <div className="row" style={{gap:8, marginTop:12}}>
          <input className="field" placeholder="Nome" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/>
          <select className="field" value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value as Agent['tipo']})}>
            {['Vendedor','Secretária','SDR','Financeiro','Logística','RH','Pós-vendas','Suporte do cliente'].map(t=> <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="row" style={{gap:8, marginTop:12}}>
          {['WhatsApp','Web','Instagram'].map(c=>(
            <label key={c} className="row" style={{gap:6,alignItems:'center'}}>
              <input type="checkbox" checked={(form.canais||[]).includes(c)} onChange={()=>toggleCanal(c)}/>
              <span>{c}</span>
            </label>
          ))}
        </div>
        <div className="mt-3">
          <textarea className="field" rows={5} placeholder="Instruções (até 6.000 chars)" value={form.instrucaoSDR||''} onChange={e=>setForm({...form, instrucaoSDR:(e.target.value||'').slice(0,MAX)})}/>
          <small className="muted">Restante: {Math.max(0, MAX-(form.instrucaoSDR?.length||0))}</small>
        </div>
        <div className="row" style={{gap:8, justifyContent:'flex-end', marginTop:12}}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!ok} onClick={()=>{ onSave(form); onClose() }}>Salvar</button>
        </div>
      </div>
    </div>
  )
}
