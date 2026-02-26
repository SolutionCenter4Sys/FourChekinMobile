import { useEffect } from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { COLORS } from '@/theme'
import { getNotificacoes } from '@/services/api'
import { useStore } from '@/store'
import AppShell from '@/components/AppShell'
import type { Notificacao, NotificacaoTipo } from '@/types'

const TIPO_CFG: Record<NotificacaoTipo, { icon: React.ReactNode; color: string; bg: string }> = {
  info:   { icon: <InfoOutlinedIcon sx={{ fontSize: 20 }} />,        color: COLORS.blue,   bg: 'rgba(59,130,246,0.12)' },
  sucesso:{ icon: <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />, color: COLORS.green,  bg: COLORS.greenMuted },
  aviso:  { icon: <WarningAmberIcon sx={{ fontSize: 20 }} />,        color: COLORS.amber,  bg: COLORS.amberMuted },
  alerta: { icon: <ErrorOutlineIcon sx={{ fontSize: 20 }} />,        color: COLORS.red,    bg: COLORS.redMuted },
}

function NotifCard({ n }: { n: Notificacao }) {
  const { marcarNotificacaoLida } = useStore()
  const cfg = TIPO_CFG[n.tipo] ?? TIPO_CFG.info

  return (
    <Box
      onClick={() => marcarNotificacaoLida(n.id)}
      sx={{
        background: n.lida ? COLORS.surface : COLORS.raised,
        borderRadius: 2, p: 2,
        border: `1px solid ${n.lida ? COLORS.border : cfg.color + '44'}`,
        display: 'flex', gap: 1.5, cursor: 'pointer',
        '&:active': { opacity: 0.85 },
      }}
    >
      <Box sx={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: cfg.color,
      }}>
        {cfg.icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
          <Typography sx={{ color: COLORS.white, fontWeight: n.lida ? 500 : 700, fontSize: 14, flex: 1, mr: 1, lineHeight: 1.3 }}>
            {n.titulo}
          </Typography>
          {!n.lida && (
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0, mt: '4px' }} />
          )}
        </Box>
        <Typography sx={{ color: COLORS.gray3, fontSize: 13, lineHeight: 1.5, mb: 0.5 }}>{n.mensagem}</Typography>
        <Typography sx={{ color: COLORS.gray4, fontSize: 11 }}>{n.data}</Typography>
      </Box>
    </Box>
  )
}

export default function NotificacoesPage() {
  const { notificacoes, setNotificacoes, loading, setLoading } = useStore()
  const naoLidas = notificacoes.filter((n) => !n.lida).length

  useEffect(() => {
    setLoading(true)
    getNotificacoes().then(setNotificacoes).catch(console.error).finally(() => setLoading(false))
  }, [setNotificacoes, setLoading])

  return (
    <AppShell>
      <AppBar position="sticky">
        <Toolbar>
          <NotificationsOutlinedIcon sx={{ mr: 1, color: COLORS.orange }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 17, flex: 1 }}>Notificações</Typography>
          {naoLidas > 0 && (
            <Typography sx={{ color: COLORS.orange, fontSize: 13, fontWeight: 700 }}>{naoLidas} não lidas</Typography>
          )}
        </Toolbar>
      </AppBar>

      {loading && <LinearProgress sx={{ '& .MuiLinearProgress-bar': { background: COLORS.orange } }} />}

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {!loading && notificacoes.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <NotificationsOutlinedIcon sx={{ fontSize: 64, color: COLORS.border, mb: 2 }} />
            <Typography sx={{ color: COLORS.gray3 }}>Nenhuma notificação.</Typography>
          </Box>
        )}
        {notificacoes.map((n) => <NotifCard key={n.id} n={n} />)}
      </Box>
    </AppShell>
  )
}
