import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import Badge from '@mui/material/Badge'
import { COLORS } from '@/theme'
import { getAudiencias } from '@/services/api'
import { useStore } from '@/store'
import StatusBadge from '@/components/StatusBadge'
import AppShell from '@/components/AppShell'
import type { Audiencia } from '@/types'

export default function AudienciasPage() {
  const navigate = useNavigate()
  const { audiencias, setAudiencias, loading, setLoading, error, setError, notificacoes } = useStore()
  const naoLidas = notificacoes.filter((n) => !n.lida).length

  const load = async () => {
    setLoading(true)
    setError(null)
    try { setAudiencias(await getAudiencias()) }
    catch (e) { setError(e instanceof Error ? e.message : 'Erro ao carregar audiências.') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, fontSize: 17 }}>
            Minhas Audiências
          </Typography>
          <IconButton onClick={() => navigate('/notificacoes')}>
            <Badge badgeContent={naoLidas || undefined} color="error" max={9}>
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {loading && <LinearProgress sx={{ background: COLORS.border, '& .MuiLinearProgress-bar': { background: COLORS.orange } }} />}

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={load}>
                Tentar novamente
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!loading && !error && audiencias.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography sx={{ color: COLORS.gray3 }}>Nenhuma audiência encontrada.</Typography>
          </Box>
        )}

        {loading && audiencias.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress sx={{ color: COLORS.orange }} />
          </Box>
        )}

        {audiencias.map((a) => <AudienciaCard key={a.id} audiencia={a} />)}
      </Box>
    </AppShell>
  )
}

function AudienciaCard({ audiencia }: { audiencia: Audiencia }) {
  const navigate = useNavigate()
  const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const dataFmt = audiencia.data ? fmt.format(new Date(audiencia.data + 'T12:00:00')) : audiencia.data

  return (
    <Box
      onClick={() => navigate(`/audiencias/${audiencia.id}`)}
      sx={{
        background: COLORS.surface, borderRadius: 2, p: 2, cursor: 'pointer',
        border: `1px solid ${audiencia.status === 'em_andamento' ? COLORS.orangeBorder : COLORS.border}`,
        '&:active': { opacity: 0.85 },
        transition: 'opacity 0.1s',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
        <Typography sx={{ color: COLORS.white, fontWeight: 600, fontSize: 15, flex: 1, mr: 1, lineHeight: 1.3 }}>
          {audiencia.nome}
        </Typography>
        <StatusBadge status={audiencia.status} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
        <BusinessOutlinedIcon sx={{ color: COLORS.orange, fontSize: 13 }} />
        <Typography sx={{ color: COLORS.gray3, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {audiencia.departamento}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <CalendarTodayOutlinedIcon sx={{ color: COLORS.gray3, fontSize: 13 }} />
        <Typography sx={{ color: COLORS.gray3, fontSize: 12 }}>
          {dataFmt} · {audiencia.horarioInicio} – {audiencia.horarioFim}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1.5 }}>
        <LocationOnOutlinedIcon sx={{ color: COLORS.gray3, fontSize: 13, mt: '2px', flexShrink: 0 }} />
        <Box>
          <Typography sx={{ color: COLORS.gray3, fontSize: 12, lineHeight: 1.4 }}>
            {audiencia.local}
          </Typography>
          {audiencia.endereco && (
            <Typography sx={{ color: COLORS.gray3, fontSize: 11, lineHeight: 1.4, opacity: 0.75 }}>
              {audiencia.endereco}
            </Typography>
          )}
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={audiencia.taxaPresenca * 100}
        sx={{ mb: 0.5, '& .MuiLinearProgress-bar': { background: audiencia.taxaPresenca >= 0.9 ? COLORS.green : COLORS.orange } }}
      />
      <Typography sx={{ color: COLORS.gray3, fontSize: 11 }}>
        {audiencia.presentes}/{audiencia.totalParticipantes} presentes · {Math.round(audiencia.taxaPresenca * 100)}%
      </Typography>
    </Box>
  )
}
