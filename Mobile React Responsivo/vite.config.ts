import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin, Connect } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

// ─── Dados Mock ───────────────────────────────────────────────────────────────

const hoje = new Date().toISOString().split('T')[0]
const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0]

const audiencias = [
  {
    id: 'AUD-001', titulo: 'Audiência de Conciliação — Contrato 2024/0012', juiz: 'Dr. Carlos Mendes',
    data: hoje, horario_inicio: '09:00', horario_fim: '10:30',
    local: 'Sala de Reuniões A — 3º Andar', sala: 'Sala A',
    latitude: -23.5505, longitude: -46.6333, raio_geofence_metros: 150,
    status: 'em_andamento', total_participantes: 12, presentes: 9, ausentes: 3, taxa_presenca: 75,
    pre_checkin_habilitado: true, offline_habilitado: true, questionario_habilitado: true,
  },
  {
    id: 'AUD-002', titulo: 'Audiência Trabalhista — Processo 0045/2025', juiz: 'Dra. Fernanda Lopes',
    data: hoje, horario_inicio: '11:00', horario_fim: '12:30',
    local: 'Sala Virtual — Microsoft Teams', sala: 'Virtual',
    latitude: -23.5489, longitude: -46.6388, raio_geofence_metros: 200,
    status: 'agendada', total_participantes: 6, presentes: 0, ausentes: 0, taxa_presenca: 0,
    pre_checkin_habilitado: true, offline_habilitado: false, questionario_habilitado: false,
  },
  {
    id: 'AUD-003', titulo: 'Mediação Cível — Contrato 2023/0789', juiz: 'Dr. Alberto Pinto',
    data: hoje, horario_inicio: '14:00', horario_fim: '16:00',
    local: 'Sala de Reuniões B — 5º Andar', sala: 'Sala B',
    latitude: -23.5521, longitude: -46.6311, raio_geofence_metros: 100,
    status: 'agendada', total_participantes: 8, presentes: 0, ausentes: 0, taxa_presenca: 0,
    pre_checkin_habilitado: true, offline_habilitado: true, questionario_habilitado: true,
  },
  {
    id: 'AUD-004', titulo: 'Audiência de Instrução — Processo 0112/2024', juiz: 'Dra. Renata Campos',
    data: ontem, horario_inicio: '10:00', horario_fim: '12:00',
    local: 'Fórum Central — Sala 7', sala: 'Sala 7',
    latitude: -23.5461, longitude: -46.6414, raio_geofence_metros: 120,
    status: 'concluida', total_participantes: 10, presentes: 10, ausentes: 0, taxa_presenca: 100,
    pre_checkin_habilitado: false, offline_habilitado: false, questionario_habilitado: false,
  },
]

const checkins = [
  { id: 'CHK-001', audiencia_id: 'AUD-001', audiencia: 'Audiência de Conciliação', data: hoje, horario: '08:58', timestamp: new Date(Date.now() - 3600000).toISOString(), local: 'Sala A', status: 'confirmado', modo_offline: false, hash_sha256: 'a3f5d8e2b1c4f7a9d2e5b8c1f4a7d0e3b6c9f2a5d8e1b4c7f0a3d6e9b2c5f8a1' },
  { id: 'CHK-002', audiencia_id: 'AUD-001', audiencia: 'Audiência de Conciliação', data: hoje, horario: '09:02', timestamp: new Date(Date.now() - 3400000).toISOString(), local: 'Sala A', status: 'confirmado', modo_offline: false, hash_sha256: 'b4g6e9f3c2d5g8b1e4f7c0d3g6b9e2f5c8d1g4b7e0f3c6d9g2b5e8f1c4d7g0b2' },
]

const notificacoes = [
  { id: 'NOT-001', tipo: 'alerta',  titulo: 'Ausência Crítica',   mensagem: 'Carla Nunes não realizou check-in. Audiência inicia em 5 min.', data_hora: new Date(Date.now() - 600000).toISOString(),  lida: false, audiencia_id: 'AUD-001' },
  { id: 'NOT-002', tipo: 'sucesso', titulo: 'Check-in Registrado',mensagem: 'Ana Souza realizou check-in às 08:58.',                        data_hora: new Date(Date.now() - 3700000).toISOString(), lida: true,  audiencia_id: 'AUD-001' },
  { id: 'NOT-003', tipo: 'info',    titulo: 'AUD-002 Confirmada', mensagem: 'Audiência Trabalhista agendada para 11:00.',                    data_hora: new Date(Date.now() - 7200000).toISOString(), lida: true,  audiencia_id: 'AUD-002' },
]

// ─── Plugin Mock ──────────────────────────────────────────────────────────────

function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-mobile',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        const url    = (req.url || '').split('?')[0].replace(/\/$/, '')
        const method = (req.method || 'GET').toUpperCase()

        if (!url.startsWith('/api/v1')) { next(); return }

        const json = (status: number, data: unknown) => {
          res.writeHead(status, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(data))
        }

        const readBody = (): Promise<Record<string, unknown>> =>
          new Promise(resolve => {
            let raw = ''
            req.on('data', (chunk: Buffer) => { raw += chunk.toString() })
            req.on('end', () => { try { resolve(JSON.parse(raw || '{}')) } catch { resolve({}) } })
          })

        console.log(`[mock-mobile] ${method} ${url}`)

        if (method === 'POST' && url === '/api/v1/auth/token') {
          json(200, { access_token: 'mock-token-foursys', token_type: 'Bearer', expires_in: 86400, user: { name: 'Rodrigo Pedrosa', email: 'rodrigo.pedrosa@banco.com.br' } })
          return
        }

        if (method === 'GET' && url === '/api/v1/audiencias') { json(200, audiencias); return }

        const audId = url.match(/^\/api\/v1\/audiencias\/([^/]+)$/)
        if (audId && method === 'GET') {
          const aud = audiencias.find(a => a.id === audId[1])
          aud ? json(200, aud) : json(404, { erro: 'Não encontrada' })
          return
        }

        const audPart = url.match(/^\/api\/v1\/audiencias\/([^/]+)\/participantes$/)
        if (audPart && method === 'GET') { json(200, []); return }

        if (method === 'GET' && url === '/api/v1/checkins') { json(200, checkins); return }

        if (method === 'POST' && url === '/api/v1/checkins') {
          readBody().then(body => {
            const hash = Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
            json(201, { id: `CHK-${Date.now()}`, evidencia_id: `EV-${Date.now()}`, hash_sha256: hash, mensagem: 'Check-in registrado com sucesso!', timestamp: new Date().toISOString() })
          })
          return
        }

        if (method === 'GET' && url === '/api/v1/notificacoes') { json(200, notificacoes); return }

        if (method === 'GET' && url === '/api/v1/questionarios/templates') {
          json(200, [{ id: 'QT-001', titulo: 'Pesquisa de Satisfação', perguntas: [
            { id: 'p1', texto: 'Como você avalia o ambiente da audiência?', tipo: 'escala', obrigatoria: true },
            { id: 'p2', texto: 'O processo de check-in foi fácil?', tipo: 'multipla_escolha', opcoes: ['Sim', 'Não', 'Parcialmente'], obrigatoria: true },
            { id: 'p3', texto: 'Comentários adicionais', tipo: 'texto', obrigatoria: false },
          ]}])
          return
        }

        if (method === 'POST' && url === '/api/v1/questionarios/respostas') {
          readBody().then(body => json(201, { id: `QR-${Date.now()}`, ...body, enviado_em: new Date().toISOString() }))
          return
        }

        json(404, { erro: `Rota não encontrada: ${method} ${url}` })
      })
    },
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5174,
  },
})
