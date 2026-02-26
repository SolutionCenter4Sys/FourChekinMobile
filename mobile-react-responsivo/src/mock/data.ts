const hoje = new Date().toLocaleDateString('en-CA')
const ontem = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')
const anteontem = new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-CA')

function toISO(date: string, h: number, m: number): string {
  return `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`
}
const hISO = (h: number, m: number) => toISO(hoje, h, m)
const oISO = (h: number, m: number) => toISO(ontem, h, m)
const aISO = (h: number, m: number) => toISO(anteontem, h, m)

function sha(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0
  return Math.abs(h).toString(16).padStart(8, '0').repeat(8).substring(0, 64)
}

// ═══════════════════════════════════════════════════════════════════════════════
// Perfis RBAC
// ═══════════════════════════════════════════════════════════════════════════════
export const perfis = [
  {
    id: 'ROLE-001', nome: 'Administrador', descricao: 'Acesso total ao sistema', cor: '#FF6600', total_usuarios: 2,
    permissoes: {
      audiencias:    { visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
      checkins:      { visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
      participantes: { visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
      evidencias:    { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      auditoria:     { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      rbac:          { visualizar: true, criar: true, editar: true, excluir: true, exportar: false },
      notificacoes:  { visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    },
  },
  {
    id: 'ROLE-002', nome: 'Gestor Jurídico', descricao: 'Cria e gerencia audiências do seu departamento', cor: '#3B82F6', total_usuarios: 3,
    permissoes: {
      audiencias:    { visualizar: true, criar: true, editar: true, excluir: false, exportar: true },
      checkins:      { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      participantes: { visualizar: true, criar: true, editar: true, excluir: false, exportar: true },
      evidencias:    { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      auditoria:     { visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
      notificacoes:  { visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    },
  },
  {
    id: 'ROLE-003', nome: 'Participante', descricao: 'Realiza check-in e responde questionários', cor: '#10B981', total_usuarios: 7,
    permissoes: {
      audiencias: { visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
      checkins:   { visualizar: true, criar: true, editar: false, excluir: false, exportar: false },
    },
  },
  {
    id: 'ROLE-004', nome: 'Auditor', descricao: 'Somente leitura — compliance e auditoria', cor: '#8B5CF6', total_usuarios: 2,
    permissoes: {
      audiencias:   { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      checkins:     { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      evidencias:   { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      auditoria:    { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
      notificacoes: { visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Usuarios — 14 (2 admin + 3 gestor + 7 participante + 2 auditor)
// ═══════════════════════════════════════════════════════════════════════════════
export const usuarios = [
  { id: 'USR-001', nome: 'Rodrigo Pedrosa',  email: 'rodrigo.pedrosa@banco.com.br',  matricula: 'MAT-001', departamento: 'TI — Sistemas',        perfil_id: 'ROLE-001', perfil_nome: 'Administrador',   ativo: true,  ultimo_acesso: hISO(8, 30) },
  { id: 'USR-002', nome: 'Marina Campos',    email: 'marina.campos@banco.com.br',    matricula: 'MAT-002', departamento: 'TI — Segurança',       perfil_id: 'ROLE-001', perfil_nome: 'Administrador',   ativo: true,  ultimo_acesso: hISO(9, 15) },
  { id: 'USR-003', nome: 'Carlos Mendes',    email: 'carlos.mendes@banco.com.br',    matricula: 'MAT-003', departamento: 'Jurídico Contencioso', perfil_id: 'ROLE-002', perfil_nome: 'Gestor Jurídico', ativo: true,  ultimo_acesso: hISO(8, 0) },
  { id: 'USR-004', nome: 'Fernanda Lopes',   email: 'fernanda.lopes@banco.com.br',   matricula: 'MAT-004', departamento: 'Jurídico Trabalhista', perfil_id: 'ROLE-002', perfil_nome: 'Gestor Jurídico', ativo: true,  ultimo_acesso: hISO(7, 45) },
  { id: 'USR-005', nome: 'Alberto Pinto',    email: 'alberto.pinto@banco.com.br',    matricula: 'MAT-005', departamento: 'Jurídico Cível',       perfil_id: 'ROLE-002', perfil_nome: 'Gestor Jurídico', ativo: true,  ultimo_acesso: oISO(16, 30) },
  { id: 'USR-006', nome: 'Ana Souza',        email: 'ana.souza@banco.com.br',        matricula: 'MAT-006', departamento: 'Jurídico Contencioso', perfil_id: 'ROLE-003', perfil_nome: 'Participante',    ativo: true,  ultimo_acesso: hISO(8, 58) },
  { id: 'USR-007', nome: 'Bruno Lima',       email: 'bruno.lima@banco.com.br',       matricula: 'MAT-007', departamento: 'Jurídico Trabalhista', perfil_id: 'ROLE-003', perfil_nome: 'Participante',    ativo: true,  ultimo_acesso: hISO(9, 2) },
  { id: 'USR-008', nome: 'Diego Faria',      email: 'diego.faria@banco.com.br',      matricula: 'MAT-008', departamento: 'Jurídico Corporativo', perfil_id: 'ROLE-003', perfil_nome: 'Participante',    ativo: true,  ultimo_acesso: hISO(9, 5) },
  { id: 'USR-009', nome: 'Gabriela Ramos',   email: 'gabriela.ramos@banco.com.br',   matricula: 'MAT-009', departamento: 'Assessoria Jurídica',  perfil_id: 'ROLE-003', perfil_nome: 'Participante',    ativo: true,  ultimo_acesso: hISO(9, 10) },
  { id: 'USR-010', nome: 'Henrique Alves',   email: 'henrique.alves@banco.com.br',   matricula: 'MAT-010', departamento: 'Jurídico Contencioso', perfil_id: 'ROLE-003', perfil_nome: 'Participante',    ativo: true,  ultimo_acesso: hISO(9, 3) },
  { id: 'USR-011', nome: 'Isabel Costa',     email: 'isabel.costa@banco.com.br',     matricula: 'MAT-011', departamento: 'Mediação',             perfil_id: 'ROLE-003', perfil_nome: 'Participante',    ativo: true,  ultimo_acesso: hISO(8, 50) },
  { id: 'USR-012', nome: 'Lucas Barbosa',    email: 'lucas.barbosa@banco.com.br',    matricula: 'MAT-012', departamento: 'Jurídico Corporativo', perfil_id: 'ROLE-003', perfil_nome: 'Participante',    ativo: false, ultimo_acesso: oISO(15, 0) },
  { id: 'USR-013', nome: 'Patrícia Duarte',  email: 'patricia.duarte@banco.com.br',  matricula: 'MAT-013', departamento: 'Compliance',           perfil_id: 'ROLE-004', perfil_nome: 'Auditor',         ativo: true,  ultimo_acesso: hISO(10, 0) },
  { id: 'USR-014', nome: 'Ricardo Monteiro', email: 'ricardo.monteiro@banco.com.br', matricula: 'MAT-014', departamento: 'Auditoria Interna',    perfil_id: 'ROLE-004', perfil_nome: 'Auditor',         ativo: true,  ultimo_acesso: oISO(17, 0) },
]

function mkPart(uid: string, checked: boolean, ts: string | null, lat: number | null, lng: number | null, prec: number | null, evId: string | null) {
  const u = usuarios.find(x => x.id === uid)!
  return {
    id: uid, nome: u.nome, email: u.email, matricula: u.matricula,
    departamento: u.departamento, cargo: 'Advogado(a)', perfil_rbac: u.perfil_nome,
    avatar_iniciais: u.nome.split(' ').map(n => n[0]).join('').substring(0, 2),
    checkin: {
      realizado: checked, timestamp: ts, latitude: lat, longitude: lng, precisao_metros: prec,
      dentro_geofence: checked ? true : null, evidencia_id: evId, hash_sha256: checked ? sha(`chk-${uid}`) : null,
    },
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Audiencias — 6 (2 em_andamento, 2 agendadas, 1 encerrada, 1 cancelada)
// ═══════════════════════════════════════════════════════════════════════════════
/* eslint-disable @typescript-eslint/no-explicit-any */
export const audiencias: any[] = [
  {
    id: 'AUD-001', nome: 'Conciliação — Contrato 2024/0012',
    departamento: 'Jurídico Contencioso — Dr. Carlos Mendes',
    data: hoje, horario_inicio: '09:00', horario_fim: '10:30',
    local: 'Sala de Reuniões A — 3º Andar', latitude: -23.5505, longitude: -46.6333,
    raio_geofence_metros: 150, status: 'em_andamento',
    total_participantes: 8, presentes: 6, ausentes: 2, taxa_presenca: 0.75,
    pre_checkin_habilitado: true, offline_habilitado: true, questionario_habilitado: true,
    participantes: [
      mkPart('USR-006', true,  hISO(8, 58), -23.5505, -46.6333, 5,  'EV-001'),
      mkPart('USR-007', true,  hISO(9, 2),  -23.5506, -46.6334, 8,  'EV-002'),
      mkPart('USR-008', true,  hISO(9, 5),  -23.5504, -46.6332, 6,  'EV-003'),
      mkPart('USR-009', true,  hISO(9, 10), -23.5503, -46.6331, 10, 'EV-004'),
      mkPart('USR-010', true,  hISO(9, 3),  -23.5508, -46.6336, 7,  'EV-005'),
      mkPart('USR-011', true,  hISO(8, 50), -23.5502, -46.6330, 3,  'EV-006'),
      mkPart('USR-012', false, null, null, null, null, null),
      { id: 'P-EXT-01', nome: 'Carla Nunes', email: 'carla.nunes@externo.com.br', matricula: 'EXT-001', departamento: 'Externo — Requerente', cargo: 'Requerente', perfil_rbac: 'Participante', avatar_iniciais: 'CN', checkin: { realizado: false, timestamp: null, latitude: null, longitude: null, precisao_metros: null, dentro_geofence: null, evidencia_id: null, hash_sha256: null } },
    ],
  },
  {
    id: 'AUD-002', nome: 'Trabalhista — Processo 0045/2025',
    departamento: 'Jurídico Trabalhista — Dra. Fernanda Lopes',
    data: hoje, horario_inicio: '11:00', horario_fim: '12:30',
    local: 'Sala Virtual — Microsoft Teams', latitude: -23.5489, longitude: -46.6388,
    raio_geofence_metros: 200, status: 'agendada',
    total_participantes: 4, presentes: 0, ausentes: 0, taxa_presenca: 0,
    pre_checkin_habilitado: true, offline_habilitado: false, questionario_habilitado: false,
    participantes: [mkPart('USR-007', false, null, null, null, null, null), mkPart('USR-008', false, null, null, null, null, null), mkPart('USR-009', false, null, null, null, null, null), mkPart('USR-010', false, null, null, null, null, null)],
  },
  {
    id: 'AUD-003', nome: 'Mediação Cível — Contrato 2023/0789',
    departamento: 'Jurídico Cível — Dr. Alberto Pinto',
    data: hoje, horario_inicio: '09:30', horario_fim: '11:00',
    local: 'Sala de Reuniões B — 5º Andar', latitude: -23.5521, longitude: -46.6311,
    raio_geofence_metros: 100, status: 'em_andamento',
    total_participantes: 6, presentes: 4, ausentes: 2, taxa_presenca: 0.667,
    pre_checkin_habilitado: true, offline_habilitado: true, questionario_habilitado: true,
    participantes: [mkPart('USR-006', true, hISO(9, 25), -23.5521, -46.6311, 4, 'EV-007'), mkPart('USR-008', true, hISO(9, 28), -23.5520, -46.6312, 6, 'EV-008'), mkPart('USR-009', true, hISO(9, 30), -23.5522, -46.6310, 5, 'EV-009'), mkPart('USR-011', true, hISO(9, 22), -23.5519, -46.6313, 8, 'EV-010'), mkPart('USR-007', false, null, null, null, null, null), mkPart('USR-010', false, null, null, null, null, null)],
  },
  {
    id: 'AUD-004', nome: 'Instrução — Processo 0112/2024',
    departamento: 'Jurídico Corporativo — Dra. Renata Campos',
    data: ontem, horario_inicio: '10:00', horario_fim: '12:00',
    local: 'Fórum Central — Sala 7', latitude: -23.5461, longitude: -46.6414,
    raio_geofence_metros: 120, status: 'encerrada',
    total_participantes: 5, presentes: 5, ausentes: 0, taxa_presenca: 1,
    pre_checkin_habilitado: false, offline_habilitado: true, questionario_habilitado: false,
    participantes: [mkPart('USR-006', true, oISO(9, 55), -23.5461, -46.6414, 12, 'EV-011'), mkPart('USR-007', true, oISO(9, 58), -23.5462, -46.6415, 9, 'EV-012'), mkPart('USR-008', true, oISO(9, 50), -23.5460, -46.6413, 7, 'EV-013'), mkPart('USR-009', true, oISO(10, 0), -23.5463, -46.6416, 11, 'EV-014'), mkPart('USR-010', true, oISO(9, 52), -23.5459, -46.6412, 5, 'EV-015')],
  },
  {
    id: 'AUD-005', nome: 'Perícia Contábil — Ação 0231/2024',
    departamento: 'Jurídico Contencioso — Dr. Carlos Mendes',
    data: hoje, horario_inicio: '14:00', horario_fim: '16:00',
    local: 'Sala de Reuniões C — 2º Andar', latitude: -23.5510, longitude: -46.6340,
    raio_geofence_metros: 100, status: 'agendada',
    total_participantes: 3, presentes: 0, ausentes: 0, taxa_presenca: 0,
    pre_checkin_habilitado: true, offline_habilitado: false, questionario_habilitado: true,
    participantes: [mkPart('USR-006', false, null, null, null, null, null), mkPart('USR-011', false, null, null, null, null, null), mkPart('USR-008', false, null, null, null, null, null)],
  },
  {
    id: 'AUD-006', nome: 'Audiência Cível — Processo 0099/2023',
    departamento: 'Jurídico Cível — Dr. Alberto Pinto',
    data: anteontem, horario_inicio: '15:00', horario_fim: '17:00',
    local: 'Fórum Regional — Sala 12', latitude: -23.5530, longitude: -46.6350,
    raio_geofence_metros: 150, status: 'cancelada',
    total_participantes: 4, presentes: 0, ausentes: 0, taxa_presenca: 0,
    pre_checkin_habilitado: false, offline_habilitado: false, questionario_habilitado: false,
    participantes: [],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Check-ins — 15 (1:1 com evidências)
// ═══════════════════════════════════════════════════════════════════════════════
export const checkins = [
  { id: 'CHK-001', evidencia_id: 'EV-001', audiencia_id: 'AUD-001', usuario_id: 'USR-006', usuario_nome: 'Ana Souza',      timestamp: hISO(8, 58), latitude: -23.5505, longitude: -46.6333, precisao_metros: 5,  dentro_geofence: true, distancia_do_local_metros: 8,  modo_offline: false, editado: false, hash_sha256: sha('CHK-001') },
  { id: 'CHK-002', evidencia_id: 'EV-002', audiencia_id: 'AUD-001', usuario_id: 'USR-007', usuario_nome: 'Bruno Lima',     timestamp: hISO(9, 2),  latitude: -23.5506, longitude: -46.6334, precisao_metros: 8,  dentro_geofence: true, distancia_do_local_metros: 15, modo_offline: false, editado: false, hash_sha256: sha('CHK-002') },
  { id: 'CHK-003', evidencia_id: 'EV-003', audiencia_id: 'AUD-001', usuario_id: 'USR-008', usuario_nome: 'Diego Faria',    timestamp: hISO(9, 5),  latitude: -23.5504, longitude: -46.6332, precisao_metros: 6,  dentro_geofence: true, distancia_do_local_metros: 12, modo_offline: false, editado: false, hash_sha256: sha('CHK-003') },
  { id: 'CHK-004', evidencia_id: 'EV-004', audiencia_id: 'AUD-001', usuario_id: 'USR-009', usuario_nome: 'Gabriela Ramos', timestamp: hISO(9, 10), latitude: -23.5503, longitude: -46.6331, precisao_metros: 10, dentro_geofence: true, distancia_do_local_metros: 25, modo_offline: false, editado: false, hash_sha256: sha('CHK-004') },
  { id: 'CHK-005', evidencia_id: 'EV-005', audiencia_id: 'AUD-001', usuario_id: 'USR-010', usuario_nome: 'Henrique Alves', timestamp: hISO(9, 3),  latitude: -23.5508, longitude: -46.6336, precisao_metros: 7,  dentro_geofence: true, distancia_do_local_metros: 38, modo_offline: false, editado: false, hash_sha256: sha('CHK-005') },
  { id: 'CHK-006', evidencia_id: 'EV-006', audiencia_id: 'AUD-001', usuario_id: 'USR-011', usuario_nome: 'Isabel Costa',   timestamp: hISO(8, 50), latitude: -23.5502, longitude: -46.6330, precisao_metros: 3,  dentro_geofence: true, distancia_do_local_metros: 42, modo_offline: true,  editado: false, hash_sha256: sha('CHK-006') },
  { id: 'CHK-007', evidencia_id: 'EV-007', audiencia_id: 'AUD-003', usuario_id: 'USR-006', usuario_nome: 'Ana Souza',      timestamp: hISO(9, 25), latitude: -23.5521, longitude: -46.6311, precisao_metros: 4,  dentro_geofence: true, distancia_do_local_metros: 5,  modo_offline: false, editado: false, hash_sha256: sha('CHK-007') },
  { id: 'CHK-008', evidencia_id: 'EV-008', audiencia_id: 'AUD-003', usuario_id: 'USR-008', usuario_nome: 'Diego Faria',    timestamp: hISO(9, 28), latitude: -23.5520, longitude: -46.6312, precisao_metros: 6,  dentro_geofence: true, distancia_do_local_metros: 14, modo_offline: false, editado: false, hash_sha256: sha('CHK-008') },
  { id: 'CHK-009', evidencia_id: 'EV-009', audiencia_id: 'AUD-003', usuario_id: 'USR-009', usuario_nome: 'Gabriela Ramos', timestamp: hISO(9, 30), latitude: -23.5522, longitude: -46.6310, precisao_metros: 5,  dentro_geofence: true, distancia_do_local_metros: 18, modo_offline: false, editado: false, hash_sha256: sha('CHK-009') },
  { id: 'CHK-010', evidencia_id: 'EV-010', audiencia_id: 'AUD-003', usuario_id: 'USR-011', usuario_nome: 'Isabel Costa',   timestamp: hISO(9, 22), latitude: -23.5519, longitude: -46.6313, precisao_metros: 8,  dentro_geofence: true, distancia_do_local_metros: 30, modo_offline: false, editado: false, hash_sha256: sha('CHK-010') },
  { id: 'CHK-011', evidencia_id: 'EV-011', audiencia_id: 'AUD-004', usuario_id: 'USR-006', usuario_nome: 'Ana Souza',      timestamp: oISO(9, 55), latitude: -23.5461, longitude: -46.6414, precisao_metros: 12, dentro_geofence: true, distancia_do_local_metros: 10, modo_offline: true,  editado: false, hash_sha256: sha('CHK-011') },
  { id: 'CHK-012', evidencia_id: 'EV-012', audiencia_id: 'AUD-004', usuario_id: 'USR-007', usuario_nome: 'Bruno Lima',     timestamp: oISO(9, 58), latitude: -23.5462, longitude: -46.6415, precisao_metros: 9,  dentro_geofence: true, distancia_do_local_metros: 20, modo_offline: true,  editado: false, hash_sha256: sha('CHK-012') },
  { id: 'CHK-013', evidencia_id: 'EV-013', audiencia_id: 'AUD-004', usuario_id: 'USR-008', usuario_nome: 'Diego Faria',    timestamp: oISO(9, 50), latitude: -23.5460, longitude: -46.6413, precisao_metros: 7,  dentro_geofence: true, distancia_do_local_metros: 15, modo_offline: false, editado: false, hash_sha256: sha('CHK-013') },
  { id: 'CHK-014', evidencia_id: 'EV-014', audiencia_id: 'AUD-004', usuario_id: 'USR-009', usuario_nome: 'Gabriela Ramos', timestamp: oISO(10, 0), latitude: -23.5463, longitude: -46.6416, precisao_metros: 11, dentro_geofence: true, distancia_do_local_metros: 28, modo_offline: false, editado: false, hash_sha256: sha('CHK-014') },
  { id: 'CHK-015', evidencia_id: 'EV-015', audiencia_id: 'AUD-004', usuario_id: 'USR-010', usuario_nome: 'Henrique Alves', timestamp: oISO(9, 52), latitude: -23.5459, longitude: -46.6412, precisao_metros: 5,  dentro_geofence: true, distancia_do_local_metros: 22, modo_offline: false, editado: false, hash_sha256: sha('CHK-015') },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Evidencias — 1:1 com check-ins, cadeia SHA-256
// ═══════════════════════════════════════════════════════════════════════════════
export const evidencias = checkins.map((c, i) => ({
  id: c.evidencia_id, checkin_id: c.id, audiencia_id: c.audiencia_id,
  usuario_id: c.usuario_id, usuario_nome: c.usuario_nome,
  timestamp_utc: c.timestamp, latitude: c.latitude, longitude: c.longitude,
  precisao_metros: c.precisao_metros, altitude_metros: 760 + (i * 3) % 20,
  fonte_gps: c.modo_offline ? 'network' : 'gps', hash_sha256: sha(`ev-${c.id}`),
  hash_anterior: i === 0 ? '0'.repeat(64) : sha(`ev-${checkins[i - 1].id}`),
  cadeia_valida: true,
  dispositivo: { tipo: 'mobile', fabricante: i % 2 === 0 ? 'Samsung' : 'Apple', modelo: i % 2 === 0 ? 'Galaxy S24' : 'iPhone 15', os_versao: i % 2 === 0 ? 'Android 14' : 'iOS 17.4', app_versao: '2.1.0' },
}))

// ═══════════════════════════════════════════════════════════════════════════════
// Notificacoes — 12
// ═══════════════════════════════════════════════════════════════════════════════
export const notificacoes = [
  { id: 'NOT-001', tipo: 'ausencia_critica', titulo: 'Ausência Crítica Detectada', corpo: 'Carla Nunes (Requerente) não realizou check-in.', usuario_nome: 'Carla Nunes',    audiencia_nome: 'Conciliação — Contrato 2024/0012',    canal: 'push',  status: 'entregue', lida: false, created_at: hISO(9, 35), enviada_em: hISO(9, 35), entregue_em: hISO(9, 35), lida_em: null },
  { id: 'NOT-002', tipo: 'ausencia_critica', titulo: 'Ausência Crítica Detectada', corpo: 'Lucas Barbosa não realizou check-in.',            usuario_nome: 'Lucas Barbosa',  audiencia_nome: 'Conciliação — Contrato 2024/0012',    canal: 'push',  status: 'falha',    lida: false, created_at: hISO(9, 36), enviada_em: hISO(9, 36), entregue_em: null,         lida_em: null },
  { id: 'NOT-003', tipo: 'checkin_confirmado', titulo: 'Check-in Confirmado', corpo: 'Ana Souza realizou check-in às 08:58.',                usuario_nome: 'Ana Souza',      audiencia_nome: 'Conciliação — Contrato 2024/0012',    canal: 'push',  status: 'lida',     lida: true,  created_at: hISO(8, 59), enviada_em: hISO(8, 59), entregue_em: hISO(8, 59), lida_em: hISO(9, 5) },
  { id: 'NOT-004', tipo: 'checkin_confirmado', titulo: 'Check-in Confirmado', corpo: 'Isabel Costa realizou check-in offline às 08:50.',      usuario_nome: 'Isabel Costa',   audiencia_nome: 'Conciliação — Contrato 2024/0012',    canal: 'push',  status: 'lida',     lida: true,  created_at: hISO(8, 51), enviada_em: hISO(8, 51), entregue_em: hISO(8, 51), lida_em: hISO(8, 55) },
  { id: 'NOT-005', tipo: 'lembrete', titulo: 'Audiência em 30 Minutos', corpo: 'Trabalhista — Processo 0045/2025 inicia às 11:00.',           usuario_nome: 'Bruno Lima',     audiencia_nome: 'Trabalhista — Processo 0045/2025',    canal: 'email', status: 'entregue', lida: false, created_at: hISO(10, 30), enviada_em: hISO(10, 30), entregue_em: hISO(10, 30), lida_em: null },
  { id: 'NOT-006', tipo: 'lembrete', titulo: 'Audiência em 30 Minutos', corpo: 'Trabalhista — Processo 0045/2025 inicia às 11:00.',           usuario_nome: 'Diego Faria',    audiencia_nome: 'Trabalhista — Processo 0045/2025',    canal: 'email', status: 'entregue', lida: false, created_at: hISO(10, 30), enviada_em: hISO(10, 30), entregue_em: hISO(10, 31), lida_em: null },
  { id: 'NOT-007', tipo: 'audiencia_criada', titulo: 'Nova Audiência Criada', corpo: 'Perícia Contábil criada para hoje às 14:00.',           usuario_nome: 'Carlos Mendes',  audiencia_nome: 'Perícia Contábil — Ação 0231/2024',   canal: 'push',  status: 'lida',     lida: true,  created_at: hISO(7, 30), enviada_em: hISO(7, 30), entregue_em: hISO(7, 30), lida_em: hISO(7, 45) },
  { id: 'NOT-008', tipo: 'audiencia_encerrada', titulo: 'Audiência Encerrada', corpo: 'Instrução — Processo 0112/2024 encerrada.',            usuario_nome: 'Fernanda Lopes', audiencia_nome: 'Instrução — Processo 0112/2024',      canal: 'push',  status: 'lida',     lida: true,  created_at: oISO(12, 5), enviada_em: oISO(12, 5), entregue_em: oISO(12, 5), lida_em: oISO(12, 20) },
  { id: 'NOT-009', tipo: 'ausencia_critica', titulo: 'Ausência Detectada', corpo: 'Bruno Lima não realizou check-in na Mediação Cível.',      usuario_nome: 'Bruno Lima',     audiencia_nome: 'Mediação Cível — Contrato 2023/0789', canal: 'push',  status: 'entregue', lida: false, created_at: hISO(9, 45), enviada_em: hISO(9, 45), entregue_em: hISO(9, 46), lida_em: null },
  { id: 'NOT-010', tipo: 'ausencia_critica', titulo: 'Ausência Detectada', corpo: 'Henrique Alves não realizou check-in na Mediação Cível.',  usuario_nome: 'Henrique Alves', audiencia_nome: 'Mediação Cível — Contrato 2023/0789', canal: 'sms',   status: 'entregue', lida: false, created_at: hISO(9, 46), enviada_em: hISO(9, 46), entregue_em: hISO(9, 47), lida_em: null },
  { id: 'NOT-011', tipo: 'audiencia_cancelada', titulo: 'Audiência Cancelada', corpo: 'Audiência Cível — Processo 0099/2023 cancelada.',      usuario_nome: 'Alberto Pinto',  audiencia_nome: 'Audiência Cível — Processo 0099/2023',canal: 'email', status: 'lida',     lida: true,  created_at: aISO(14, 0), enviada_em: aISO(14, 0), entregue_em: aISO(14, 1), lida_em: aISO(14, 30) },
  { id: 'NOT-012', tipo: 'csv_upload', titulo: 'Upload Concluído', corpo: '8 participantes importados via CSV.',                              usuario_nome: 'Rodrigo Pedrosa',audiencia_nome: 'Conciliação — Contrato 2024/0012',    canal: 'push',  status: 'lida',     lida: true,  created_at: hISO(7, 0), enviada_em: hISO(7, 0), entregue_em: hISO(7, 0), lida_em: hISO(7, 10) },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Questionario Templates
// ═══════════════════════════════════════════════════════════════════════════════
export const questionarioTemplates = [
  { id: 'QT-001', titulo: 'Pesquisa de Satisfação — Padrão', perguntas: [
    { id: 'p1', texto: 'Como você avalia o ambiente da audiência?', tipo: 'escala', obrigatoria: true },
    { id: 'p2', texto: 'O processo de check-in foi fácil?', tipo: 'multipla_escolha', opcoes: ['Sim', 'Não', 'Parcialmente'], obrigatoria: true },
    { id: 'p3', texto: 'A duração foi adequada?', tipo: 'multipla_escolha', opcoes: ['Muito curta', 'Adequada', 'Muito longa'], obrigatoria: true },
    { id: 'p4', texto: 'Comentários adicionais', tipo: 'texto', obrigatoria: false },
  ]},
]
