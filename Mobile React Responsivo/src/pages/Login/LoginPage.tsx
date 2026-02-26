import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { COLORS } from '@/theme'
import { loginSSO } from '@/services/api'
import { useStore } from '@/store'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUsuario, setToken, onboardingConcluido } = useStore()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true); setErro(null)
    try {
      const { token, usuario } = await loginSSO()
      setToken(token)
      setUsuario({ id: usuario.id, nome: usuario.nome, email: usuario.email, cargo: usuario.cargo })
      navigate(onboardingConcluido ? '/home' : '/onboarding', { replace: true })
    } catch {
      setErro('Falha na autenticação. Tente novamente ou contate o suporte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100svh', background: COLORS.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 3, py: 4 }}>
      {/* Spacer top */}
      <Box flex={2} />

      {/* Logo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{
          width: 80, height: 80, borderRadius: '20px',
          background: COLORS.orangeMuted,
          border: `1px solid ${COLORS.orangeBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LocationOnIcon sx={{ color: COLORS.orange, fontSize: 40 }} />
        </Box>

        <Typography variant="h4" sx={{ color: COLORS.white, fontWeight: 800, lineHeight: 1.2 }}>
          CheckIn Audiências
        </Typography>
        <Typography sx={{ color: COLORS.orange, fontWeight: 600, fontSize: 14 }}>
          Foursys
        </Typography>
        <Typography sx={{ color: COLORS.gray3, fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
          Registro de presença em audiências bancárias com GPS e evidência imutável.
        </Typography>
      </Box>

      {/* Spacer middle */}
      <Box flex={1} />

      {/* Botões */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.white }} /> : <BusinessCenterOutlinedIcon />}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Autenticando...' : 'Entrar com SSO Corporativo'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<FingerprintIcon />}
          onClick={handleLogin}
          disabled={loading}
        >
          Biometria / Face ID
        </Button>

        {erro && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.5, background: COLORS.redMuted, borderRadius: 2, border: `1px solid ${COLORS.red}44` }}>
            <ErrorOutlineIcon sx={{ color: COLORS.red, fontSize: 18, mt: '2px', flexShrink: 0 }} />
            <Typography sx={{ color: COLORS.red, fontSize: 13 }}>{erro}</Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box flex={2} />
      <Typography textAlign="center" sx={{ color: COLORS.gray4, fontSize: 11 }}>
        v1.0.0 · Secure · OAuth2 PKCE + OIDC
      </Typography>
    </Box>
  )
}
