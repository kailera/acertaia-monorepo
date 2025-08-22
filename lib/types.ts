export type Agent = {
  id: string
  nome: string
  tipo: 'Vendedor'|'Secretária'|'SDR'|'Financeiro'|'Logística'|'RH'|'Pós-vendas'|'Suporte do cliente'|'Supervisor'
  role: 'Supervisor'|'Agente'|'Sub'
  canais: string[]
  status: 'ATIVO'|'PAUSADO'|'RASCUNHO'
  persona?: string
  instrucaoSDR?: string
  follow?: { t1Min: number; t2Min: number }
  escalonamento?: { minutos: number; para: string; notificarTelefone?: string }
  agenda?: Record<string, string>
  meta?: { mql: number; sql: number; fechado: number }
  saude?: 'ok'|'med'|'bad'
  color?: string
  parentId?: string
}

export type Team = {
  id: string
  nome: string
  ativo: boolean
  color?: string
  membros: string[]
  prioridade: string[]
  regras: { id: string; de: string; para: string; condicao?: string; kind?: 'main'|'cond'|'fallback' }[]
}
