import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import QuizIcon from '@mui/icons-material/Quiz'
import { COLORS } from '@/theme'
import { getAudiencia } from '@/services/api'
import StatusBadge from '@/components/StatusBadge'
import GeoMap from '@/components/GeoMap'
import AppShell from '@/components/AppShell'
import type { Audiencia } from '@/types'

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', py: 1.5 }}>
      <Box sx={{ color: COLORS.orange, mt: '2px' }}>{icon}</Box>
      <Box>
        <Typography sx={{ color: COLORS.gray4, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Typography>
        <Typography sx={{ color: COLORS.white, fontSize: 14, mt: 0.25 }}>{value}</Typography>
      </Box>
    </Box>
  )
}

export default function AudienciaDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [audiencia, setAudiencia] = useState<Audiencia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getAudiencia(id)
      .then(setAudiencia)
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Erro ao carregar audiência.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <Box sx={{ minHeight: '100svh', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress sx={{ color: COLORS.orange }} />
    </Box>
  )

  if (error || !audiencia) return (
    <AppShell showNav={false}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, fontSize: 16, ml: 1 }}>Detalhe da Audiência</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate(-1)}>
              Voltar
            </Button>
          }
        >
          {error ?? 'Audiência não encontrada.'}
        </Alert>
      </Box>
    </AppShell>
  )

  return (
    <AppShell>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, fontSize: 16, ml: 1 }}>Detalhe da Audiência</Typography>
          <StatusBadge status={audiencia.status} />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Header */}
        <Box sx={{ background: COLORS.surface, borderRadius: 2, p: 2, border: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ color: COLORS.white, fontWeight: 700, fontSize: 17, lineHeight: 1.3, mb: 0.5 }}>
            {audiencia.nome}
          </Typography>
          <Typography sx={{ color: COLORS.orange, fontSize: 12, fontWeight: 600 }}>{audiencia.departamento}</Typography>
        </Box>

        {/* Info */}
        <Box sx={{ background: COLORS.surface, borderRadius: 2, px: 2, border: `1px solid ${COLORS.border}` }}>
          <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label="Data e Horário"
            value={`${audiencia.data ? fmt.format(new Date(audiencia.data + 'T12:00:00')) : ''} · ${audiencia.horarioInicio} – ${audiencia.horarioFim}`} />
          <Divider sx={{ borderColor: COLORS.border }} />
          <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Local" value={audiencia.local} />
          <Divider sx={{ borderColor: COLORS.border }} />
          <InfoRow icon={<PeopleIcon fontSize="small" />} label="Participantes"
            value={`${audiencia.presentes} de ${audiencia.totalParticipantes} presentes`} />
        </Box>

        {/* Presença */}
        <Box sx={{ background: COLORS.surface, borderRadius: 2, p: 2, border: `1px solid ${COLORS.border}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: COLORS.gray3, fontSize: 13 }}>Taxa de Presença</Typography>
            <Typography sx={{ color: audiencia.taxaPresenca >= 0.9 ? COLORS.green : COLORS.orange, fontWeight: 700, fontSize: 13 }}>
              {Math.round(audiencia.taxaPresenca * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={audiencia.taxaPresenca * 100}
            sx={{ '& .MuiLinearProgress-bar': { background: audiencia.taxaPresenca >= 0.9 ? COLORS.green : COLORS.orange } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography sx={{ color: COLORS.green, fontSize: 11 }}>✓ {audiencia.presentes} presentes</Typography>
            <Typography sx={{ color: COLORS.red, fontSize: 11 }}>✗ {audiencia.ausentes} ausentes</Typography>
          </Box>
        </Box>

        {/* Ações */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          {audiencia.status === 'em_andamento' || audiencia.status === 'agendada' ? (
            <Button variant="contained" startIcon={<HowToRegIcon />} onClick={() => navigate(`/checkin/${audiencia.id}`)}>
              Realizar Check-in
            </Button>
          ) : null}
          {audiencia.questionarioHabilitado && (
            <Button variant="outlined" startIcon={<QuizIcon />} onClick={() => navigate(`/questionario/${audiencia.id}`)}>
              Responder Questionário
            </Button>
          )}
        </Box>

        {/* Mapa real com geofence */}
        <GeoMap
          lat={audiencia.latitude}
          lng={audiencia.longitude}
          raioMetros={audiencia.raioGeofenceMetros}
          titulo={audiencia.nome}
          height={220}
        />

        {/* Geofence info */}
        <Box sx={{ background: COLORS.raised, borderRadius: 2, p: 1.5, border: `1px solid ${COLORS.border}` }}>
          <Typography sx={{ color: COLORS.gray4, fontSize: 11 }}>
            📍 Geofence: {audiencia.raioGeofenceMetros}m · Lat {audiencia.latitude.toFixed(4)}, Lng {audiencia.longitude.toFixed(4)}
          </Typography>
          {audiencia.offlineHabilitado && (
            <Typography sx={{ color: COLORS.amber, fontSize: 11, mt: 0.5 }}>📶 Modo offline habilitado para esta audiência</Typography>
          )}
        </Box>
      </Box>
    </AppShell>
  )
}
