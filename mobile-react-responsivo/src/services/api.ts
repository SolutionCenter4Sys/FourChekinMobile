import axios from 'axios'
import type { Audiencia, CheckinRequest, CheckinResponse, Checkin, Notificacao, Questionario } from '@/types'
import { installMockAdapter } from '@/mock/adapter'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

installMockAdapter(api)

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token') || 'mock-token-foursys'
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Audiências ──────────────────────────────────────────────────────────────
export async function getAudiencias(): Promise<Audiencia[]> {
  const { data } = await api.get('/audiencias')
  return (data.data || data).map((a: Record<string, unknown>) => ({
    id: String(a.id),
    nome: a.titulo || a.nome,
    departamento: a.juiz || a.departamento || 'Departamento',
    data: a.data,
    horarioInicio: a.horario_inicio || '09:00',
    horarioFim: a.horario_fim || '11:00',
    local: a.local || a.sala || 'Sala 1',
    endereco: a.endereco ? String(a.endereco) : undefined,
    latitude: Number(a.latitude ?? -23.5505),
    longitude: Number(a.longitude ?? -46.6333),
    raioGeofenceMetros: Number(a.raio_geofence_metros ?? 100),
    status: (a.status as string) || 'agendada',
    totalParticipantes: Number(a.total_participantes ?? a.participantes ?? 10),
    presentes: Number(a.presentes ?? 0),
    ausentes: Number(a.ausentes ?? 0),
    taxaPresenca: Number(a.taxa_presenca ?? 0),
    preCheckinHabilitado: Boolean(a.pre_checkin_habilitado ?? true),
    offlineHabilitado: Boolean(a.offline_habilitado ?? true),
    questionarioHabilitado: Boolean(a.questionario_habilitado ?? false),
  }))
}

export async function getAudiencia(id: string): Promise<Audiencia> {
  const lista = await getAudiencias()
  const found = lista.find((a) => a.id === id)
  if (!found) throw new Error('Audiência não encontrada')
  return found
}

// ─── Check-in ────────────────────────────────────────────────────────────────
export async function registrarCheckin(req: CheckinRequest): Promise<CheckinResponse> {
  const { data } = await api.post('/checkins', {
    audiencia_id: req.audienciaId,
    latitude: req.latitude,
    longitude: req.longitude,
    precisao_metros: req.precisaoMetros,
    altitude_metros: req.altitudeMetros,
    timestamp: req.timestamp,
    modo_offline: req.modoOffline,
  })
  return {
    id: data.id || `CHK-${Date.now()}`,
    evidenciaId: data.evidencia_id || `EV-${Date.now()}`,
    hashSha256: data.hash_sha256 || 'a'.repeat(64),
    mensagem: data.mensagem || 'Check-in registrado com sucesso!',
    modoOffline: req.modoOffline,
    timestamp: new Date().toISOString(),
  }
}

export async function getCheckins(): Promise<Checkin[]> {
  const { data } = await api.get('/checkins')
  return (data.data || data).map((c: Record<string, unknown>) => ({
    id: String(c.id),
    audienciaId: String(c.audiencia_id ?? ''),
    audienciaNome: String(c.audiencia_nome ?? c.audiencia ?? 'Audiência'),
    data: String(c.data ?? ''),
    horario: String(c.horario ?? c.timestamp ?? ''),
    local: String(c.local ?? 'Local'),
    status: (c.status as string) || 'confirmado',
    modoOffline: Boolean(c.modo_offline),
    hashSha256: String(c.hash_sha256 ?? ''),
  }))
}

// ─── Notificações ─────────────────────────────────────────────────────────────
export async function getNotificacoes(): Promise<Notificacao[]> {
  const { data } = await api.get('/notificacoes')
  return (data.data || data).map((n: Record<string, unknown>) => ({
    id: String(n.id),
    tipo: (n.tipo as string) || 'info',
    titulo: String(n.titulo),
    mensagem: String(n.mensagem ?? n.corpo),
    data: String(n.data_hora || n.created_at || n.data || ''),
    lida: Boolean(n.lida),
    audienciaId: n.audiencia_id ? String(n.audiencia_id) : undefined,
  }))
}

// ─── Questionário ─────────────────────────────────────────────────────────────
export async function getQuestionario(audienciaId: string): Promise<Questionario> {
  const { data } = await api.get('/questionarios/templates')
  const templates = data.data || data
  const tpl = templates[0]
  return {
    id: tpl?.id || 'q1',
    audienciaId,
    titulo: tpl?.titulo || 'Pesquisa de Satisfação',
    perguntas: (tpl?.perguntas || []).map((p: Record<string, unknown>) => ({
      id: String(p.id),
      texto: String(p.texto),
      tipo: p.tipo as string,
      opcoes: p.opcoes as string[] | undefined,
      obrigatoria: Boolean(p.obrigatoria),
    })),
  }
}

// ─── Auth (simulado) ─────────────────────────────────────────────────────────
export async function loginSSO(): Promise<{ token: string; usuario: { id: string; nome: string; email: string; cargo: string } }> {
  const { data } = await api.post('/auth/token', { grant_type: 'authorization_code', code: 'sso-mock' })
  return {
    token: data.access_token || 'mock-token-foursys',
    usuario: {
      id: 'USR-001',
      nome: data.user?.name || 'Rodrigo Pedrosa',
      email: data.user?.email || 'rodrigo.pedrosa@banco.com.br',
      cargo: 'Advogado Corporativo',
    },
  }
}
