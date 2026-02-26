import { useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import HomeIcon from '@mui/icons-material/Home'
import EventNoteIcon from '@mui/icons-material/EventNote'
import { COLORS } from '@/theme'
import AppShell from '@/components/AppShell'

export default function ConfirmacaoPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as {
    state: { id: string; evidenciaId: string; hashSha256: string; modoOffline: boolean; mensagem: string }
  }

  const offline = state?.modoOffline
  const hash = state?.hashSha256 ?? ''
  const hashDisplay = hash.length > 16 ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash

  return (
    <AppShell showNav={false}>
      <Box sx={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', p: 3, gap: 3, textAlign: 'center',
      }}>
        {/* Ícone */}
        <Box sx={{
          width: 120, height: 120, borderRadius: '50%',
          background: offline ? COLORS.amberMuted : COLORS.greenMuted,
          border: `3px solid ${offline ? COLORS.amber : COLORS.green}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {offline
            ? <CloudOffIcon sx={{ fontSize: 64, color: COLORS.amber }} />
            : <CheckCircleIcon sx={{ fontSize: 64, color: COLORS.green }} />}
        </Box>

        {/* Mensagem */}
        <Box>
          <Typography variant="h5" sx={{ color: offline ? COLORS.amber : COLORS.green, fontWeight: 700, mb: 1 }}>
            {offline ? 'Check-in Salvo Offline' : 'Check-in Confirmado!'}
          </Typography>
          <Typography sx={{ color: COLORS.gray3, fontSize: 14, lineHeight: 1.6 }}>
            {state?.mensagem ?? 'Check-in registrado com sucesso.'}
          </Typography>
        </Box>

        {/* Evidência */}
        <Box sx={{ background: COLORS.surface, borderRadius: 2, p: 2, border: `1px solid ${COLORS.border}`, width: '100%' }}>
          <Typography sx={{ color: COLORS.gray4, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', mb: 1 }}>
            Evidência Digital
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: COLORS.gray3, fontSize: 12 }}>ID do Check-in</Typography>
              <Typography sx={{ color: COLORS.white, fontSize: 12, fontFamily: 'monospace' }}>{state?.id ?? '–'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: COLORS.gray3, fontSize: 12 }}>ID Evidência</Typography>
              <Typography sx={{ color: COLORS.white, fontSize: 12, fontFamily: 'monospace' }}>{state?.evidenciaId ?? '–'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: COLORS.gray3, fontSize: 12 }}>SHA-256</Typography>
              <Typography sx={{ color: offline ? COLORS.amber : COLORS.green, fontSize: 11, fontFamily: 'monospace' }}>
                {offline ? 'pendente sync' : hashDisplay}
              </Typography>
            </Box>
          </Box>
        </Box>

        {offline && (
          <Box sx={{ background: COLORS.amberMuted, borderRadius: 2, p: 1.5, border: `1px solid ${COLORS.amber}44`, width: '100%' }}>
            <Typography sx={{ color: COLORS.amber, fontSize: 12, lineHeight: 1.5 }}>
              📶 Será sincronizado automaticamente quando houver conexão.
            </Typography>
          </Box>
        )}

        {/* Ações */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mt: 1 }}>
          <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate('/home')}>
            Voltar ao Início
          </Button>
          <Button variant="outlined" startIcon={<EventNoteIcon />} onClick={() => navigate('/historico')}>
            Ver Histórico
          </Button>
        </Box>
      </Box>
    </AppShell>
  )
}
