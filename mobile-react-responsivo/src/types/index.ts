// ─── Enums ───────────────────────────────────────────────────────────────────
export type AudienciaStatus = 'agendada' | 'em_andamento' | 'encerrada' | 'cancelada'
export type GeoStatus = 'verificando' | 'dentro' | 'fora' | 'offline' | 'gps_indisponivel' | 'sem_permissao'
export type NotificacaoTipo = 'alerta' | 'info' | 'sucesso' | 'aviso'

// ─── Entidades ────────────────────────────────────────────────────────────────
export interface Audiencia {
  id: string
  nome: string
  departamento: string
  data: string
  horarioInicio: string
  horarioFim: string
  local: string
  endereco?: string
  latitude: number
  longitude: number
  raioGeofenceMetros: number
  status: AudienciaStatus
  totalParticipantes: number
  presentes: number
  ausentes: number
  taxaPresenca: number
  preCheckinHabilitado: boolean
  offlineHabilitado: boolean
  questionarioHabilitado: boolean
}

export interface CheckinRequest {
  audienciaId: string
  latitude: number
  longitude: number
  precisaoMetros: number
  altitudeMetros?: number
  timestamp: string
  modoOffline: boolean
}

export interface CheckinResponse {
  id: string
  evidenciaId: string
  hashSha256: string
  mensagem: string
  modoOffline: boolean
  timestamp: string
}

export interface Checkin {
  id: string
  audienciaId: string
  audienciaNome: string
  data: string
  horario: string
  local: string
  status: 'confirmado' | 'pendente_sync' | 'rejeitado'
  modoOffline: boolean
  hashSha256: string
}

export interface Notificacao {
  id: string
  tipo: NotificacaoTipo
  titulo: string
  mensagem: string
  data: string
  lida: boolean
  audienciaId?: string
}

export interface Questionario {
  id: string
  audienciaId: string
  titulo: string
  perguntas: Pergunta[]
}

export interface Pergunta {
  id: string
  texto: string
  tipo: 'multipla_escolha' | 'texto' | 'escala'
  opcoes?: string[]
  obrigatoria: boolean
}

export interface RespostaQuestionario {
  perguntaId: string
  resposta: string | number
}

export interface Usuario {
  id: string
  nome: string
  email: string
  cargo: string
  avatar?: string
}

export interface GeoResult {
  status: GeoStatus
  mensagem: string
  latitude?: number
  longitude?: number
  precisao?: number
  distanciaMetros?: number
}
