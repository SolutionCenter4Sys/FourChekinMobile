import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MobileStepper from '@mui/material/MobileStepper'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WifiOffIcon from '@mui/icons-material/WifiOff'
import VerifiedIcon from '@mui/icons-material/Verified'
import { COLORS } from '@/theme'
import { useStore } from '@/store'

const STEPS = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 64, color: COLORS.orange }} />,
    titulo: 'Check-in por GPS',
    descricao: 'Registre sua presença automaticamente quando estiver dentro da área geofence da audiência. Sem papel, sem filas.',
    cor: COLORS.orange,
  },
  {
    icon: <WifiOffIcon sx={{ fontSize: 64, color: COLORS.amber }} />,
    titulo: 'Funciona Offline',
    descricao: 'Sem conexão? Sem problema. O check-in é salvo localmente e sincronizado automaticamente ao reconectar.',
    cor: COLORS.amber,
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 64, color: COLORS.green }} />,
    titulo: 'Evidência Imutável',
    descricao: 'Cada check-in gera um hash SHA-256 único. Sua presença fica registrada de forma permanente e auditável.',
    cor: COLORS.green,
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const setOnboardingConcluido = useStore((s) => s.setOnboardingConcluido)
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  const handleNext = () => {
    if (isLast) {
      setOnboardingConcluido(true)
      navigate('/home', { replace: true })
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleSkip = () => {
    setOnboardingConcluido(true)
    navigate('/home', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100svh', background: COLORS.bg, display: 'flex', flexDirection: 'column', px: 3, py: 4 }}>
      {/* Skip */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="text" size="small" onClick={handleSkip} sx={{ color: COLORS.gray4, minHeight: 'auto', p: 0, fontSize: 13 }}>
          Pular
        </Button>
      </Box>

      {/* Conteúdo */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <Box sx={{
          width: 140, height: 140, borderRadius: '50%',
          background: `${current.cor}1A`,
          border: `2px solid ${current.cor}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {current.icon}
        </Box>

        <Box sx={{ textAlign: 'center', maxWidth: 320 }}>
          <Typography variant="h5" sx={{ color: COLORS.white, fontWeight: 700, mb: 2 }}>
            {current.titulo}
          </Typography>
          <Typography sx={{ color: COLORS.gray3, fontSize: 15, lineHeight: 1.7 }}>
            {current.descricao}
          </Typography>
        </Box>
      </Box>

      {/* Stepper + botão */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <MobileStepper
          variant="dots"
          steps={STEPS.length}
          position="static"
          activeStep={step}
          sx={{
            background: 'transparent', p: 0,
            '& .MuiMobileStepper-dot': { background: COLORS.border },
            '& .MuiMobileStepper-dotActive': { background: COLORS.orange },
          }}
          nextButton={null}
          backButton={null}
        />
        <Button variant="contained" onClick={handleNext} fullWidth>
          {isLast ? 'Começar' : 'Próximo'}
        </Button>
      </Box>
    </Box>
  )
}
