import { useEffect } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import CancelIcon from '@mui/icons-material/Cancel'
import HistoryIcon from '@mui/icons-material/History'
import { COLORS } from '@/theme'
import { getCheckins } from '@/services/api'
import { useStore } from '@/store'
import AppShell from '@/components/AppShell'
import type { Checkin } from '@/types'

const STATUS_CFG = {
  confirmado:    { icon: <CheckCircleIcon sx={{ fontSize: 16, color: COLORS.green }} />, color: COLORS.green,  label: 'Confirmado' },
  pendente_sync: { icon: <CloudOffIcon sx={{ fontSize: 16, color: COLORS.amber }} />,   color: COLORS.amber,  label: 'Pendente Sync' },
  rejeitado:     { icon: <CancelIcon sx={{ fontSize: 16, color: COLORS.red }} />,       color: COLORS.red,    label: 'Rejeitado' },
}

function HistoricoCard({ c }: { c: Checkin }) {
  const cfg = STATUS_CFG[c.status] ?? STATUS_CFG.confirmado
  const hashDisplay = c.hashSha256.length > 16 ? `${c.hashSha256.slice(0, 8)}...${c.hashSha256.slice(-6)}` : c.hashSha256

  return (
    <Box sx={{ background: COLORS.surface, borderRadius: 2, p: 2, border: `1px solid ${COLORS.border}` }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography sx={{ color: COLORS.white, fontWeight: 600, fontSize: 14, flex: 1, mr: 1, lineHeight: 1.3 }}>
          {c.audienciaNome}
        </Typography>
        <Chip
          size="small"
          icon={cfg.icon}
          label={cfg.label}
          sx={{ background: `${cfg.color}1A`, color: cfg.color, border: `1px solid ${cfg.color}33`, fontWeight: 700, fontSize: 10, height: 22 }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        <Typography sx={{ color: COLORS.gray3, fontSize: 12 }}>📅 {c.data} · {c.horario}</Typography>
        <Typography sx={{ color: COLORS.gray3, fontSize: 12 }}>📍 {c.local}</Typography>
        {c.hashSha256 && c.status === 'confirmado' && (
          <Typography sx={{ color: COLORS.gray4, fontSize: 10, fontFamily: 'monospace', mt: 0.5 }}>SHA: {hashDisplay}</Typography>
        )}
        {c.modoOffline && (
          <Typography sx={{ color: COLORS.amber, fontSize: 11, mt: 0.5 }}>📶 Registrado offline</Typography>
        )}
      </Box>
    </Box>
  )
}

export default function HistoricoPage() {
  const { checkins, setCheckins, loading, setLoading } = useStore()

  useEffect(() => {
    setLoading(true)
    getCheckins().then(setCheckins).catch(console.error).finally(() => setLoading(false))
  }, [setCheckins, setLoading])

  return (
    <AppShell>
      <AppBar position="sticky">
        <Toolbar>
          <HistoryIcon sx={{ mr: 1, color: COLORS.orange }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 17 }}>Meu Histórico</Typography>
        </Toolbar>
      </AppBar>

      {loading && <LinearProgress sx={{ '& .MuiLinearProgress-bar': { background: COLORS.orange } }} />}

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {!loading && checkins.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <HistoryIcon sx={{ fontSize: 64, color: COLORS.border, mb: 2 }} />
            <Typography sx={{ color: COLORS.gray3 }}>Nenhum check-in registrado ainda.</Typography>
          </Box>
        )}
        {checkins.map((c) => <HistoricoCard key={c.id} c={c} />)}
      </Box>
    </AppShell>
  )
}
