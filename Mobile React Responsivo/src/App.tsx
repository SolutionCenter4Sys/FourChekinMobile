import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '@/store'
import LoginPage from '@/pages/Login/LoginPage'
import OnboardingPage from '@/pages/Onboarding/OnboardingPage'
import AudienciasPage from '@/pages/Audiencias/AudienciasPage'
import AudienciaDetalhePage from '@/pages/AudienciaDetalhe/AudienciaDetalhePage'
import CheckInPage from '@/pages/CheckIn/CheckInPage'
import ConfirmacaoPage from '@/pages/Confirmacao/ConfirmacaoPage'
import HistoricoPage from '@/pages/Historico/HistoricoPage'
import NotificacoesPage from '@/pages/Notificacoes/NotificacoesPage'
import QuestionarioPage from '@/pages/Questionario/QuestionarioPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const usuario = useStore((s) => s.usuario)
  const token = sessionStorage.getItem('auth_token')
  if (!usuario && !token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { setIsOnline } = useStore()

  // Detectar online/offline
  useEffect(() => {
    const onOnline  = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online',  onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [setIsOnline])

  return (
    <Routes>
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route path="/home"         element={<RequireAuth><AudienciasPage /></RequireAuth>} />
      <Route path="/audiencias/:id" element={<RequireAuth><AudienciaDetalhePage /></RequireAuth>} />
      <Route path="/checkin/:id"  element={<RequireAuth><CheckInPage /></RequireAuth>} />
      <Route path="/confirmacao"  element={<RequireAuth><ConfirmacaoPage /></RequireAuth>} />
      <Route path="/historico"    element={<RequireAuth><HistoricoPage /></RequireAuth>} />
      <Route path="/notificacoes" element={<RequireAuth><NotificacoesPage /></RequireAuth>} />
      <Route path="/questionario/:id" element={<RequireAuth><QuestionarioPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
