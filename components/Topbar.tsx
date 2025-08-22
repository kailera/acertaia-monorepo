'use client'
import { CAT_BG } from '@/lib/constants'

export function Topbar({route,setRoute,search,setSearch}:{route:string;setRoute:(r:string)=>void;search:string;setSearch:(s:string)=>void;}){
  const tabs=[{href:'/agentes/lista',label:'Meus Agentes'},{href:'/times',label:'Times'}]
  const label = (tabs.find(t=>t.href===route)?.label) || 'Home'
  return (
    <div className="topbar" style={{backgroundImage:`linear-gradient(0deg, rgba(14,15,18,.18), rgba(14,15,18,.18)), url("${CAT_BG}")`, backgroundSize:'cover', backgroundPosition:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <div style={{fontWeight:700}}>Acerta IA</div>
        <span className="muted" style={{fontSize:13}}>• {label}</span>
        <div style={{marginLeft:12}} className="tabs">
          {tabs.map(t=>(
            <button key={t.href} className={`tab ${route===t.href?'active':''}`} onClick={()=>setRoute(t.href)}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <input className="field" placeholder="Buscar…" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:260}}/>
      </div>
    </div>
  )
}
