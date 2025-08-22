import type { Agent, Team } from './types'

export const TIPOS = ['Vendedor','Secretária','SDR','Financeiro','Logística','RH','Pós-vendas','Suporte do cliente'] as const
export const CAT_ICON: Record<string,string> = { Vendedor:'💼','Secretária':'📎','SDR':'📣','Financeiro':'💳','Logística':'🚚','RH':'🧑‍💼','Pós-vendas':'✅','Suporte do cliente':'🎧' }

export const INIT_AGENTS: Agent[] = [
  { id:'a-super', nome:'Supervisor Geral', tipo:'Supervisor', role:'Supervisor', canais:[], status:'ATIVO', persona:'Orquestra times e políticas', instrucaoSDR:'Políticas globais.', follow:{t1Min:15,t2Min:1440}, escalonamento:{minutos:10, para:'Supervisor'}, meta:{mql:0,sql:0,fechado:0}, saude:'ok', color:'#7C3AED' },
  { id:'a-vend', nome:'Vendedor', tipo:'Vendedor', role:'Agente', canais:['WhatsApp','Web'], status:'ATIVO', persona:'Fecha pedidos', instrucaoSDR:'Abordagem consultiva', follow:{t1Min:30,t2Min:1440}, escalonamento:{minutos:20, para:'Supervisor'}, meta:{mql:30,sql:18,fechado:12}, saude:'ok', color:'#F97316' },
  { id:'a-sec', nome:'Secretária (Principal)', tipo:'Secretária', role:'Agente', canais:['WhatsApp'], status:'ATIVO', persona:'Acolhedora', instrucaoSDR:'Ofereça 3 janelas', follow:{t1Min:15,t2Min:1440}, escalonamento:{minutos:15, para:'SDR humano'}, agenda:{manhaIni:'08:00',manhaFim:'12:00',almocoIni:'12:00',almocoFim:'14:00',tardeIni:'14:00',tardeFim:'18:00'}, meta:{mql:26,sql:12,fechado:6}, saude:'ok', color:'#0EA5E9' },
  { id:'a-sdr', nome:'SDR Vendas', tipo:'SDR', role:'Agente', canais:['Instagram'], status:'ATIVO', persona:'Qualifica', instrucaoSDR:'SPIN/BANT', follow:{t1Min:20,t2Min:1440}, escalonamento:{minutos:25, para:'Supervisor'}, meta:{mql:34,sql:20,fechado:7}, saude:'med', color:'#EF4444' }
]

export const INIT_TEAMS: Team[] = [
  { id:'t-1', nome:'Atendimento & Vendas', ativo:true, color:'#7C3AED', membros:['a-sec','a-sdr','a-vend'], prioridade:['a-sec','a-sdr','a-vend'], regras:[{id:'rg-1', de:'a-sec', para:'a-sdr', condicao:'Sem agenda', kind:'cond'}] }
]

export const CAT_BG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'><defs><radialGradient id='r1' cx='20%' cy='30%' r='50%'><stop offset='0%' stop-color='#22c55e' stop-opacity='.25'/><stop offset='100%' stop-color='#22c55e' stop-opacity='0'/></radialGradient><radialGradient id='r2' cx='85%' cy='75%' r='45%'><stop offset='0%' stop-color='#22c55e' stop-opacity='.3'/><stop offset='100%' stop-color='#22c55e' stop-opacity='0'/></radialGradient></defs><rect width='100%' height='100%' fill='#0e0f12'/><rect width='100%' height='100%' fill='url(#r1)'/><rect width='100%' height='100%' fill='url(#r2)'/></svg>`
)}`
