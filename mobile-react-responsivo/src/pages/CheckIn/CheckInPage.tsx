import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WifiOffIcon from '@mui/icons-material/WifiOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined'
import GpsOffIcon from '@mui/icons-material/GpsOff'
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import RefreshIcon from '@mui/icons-material/Refresh'
import { COLORS } from '@/theme'
import { getAudiencia, registrarCheckin } from '@/services/api'
import { useStore } from '@/store'
import GeoMap from '@/components/GeoMap'
import AppShell from '@/components/AppShell'
import type { Audiencia, GeoResult } from '@/types'

function calcDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function CheckInPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isOnline = useStore((s) => s.isOnline)
  const [audiencia, setAudiencia] = useState<Audiencia | null>(null)
  const [geoResult, setGeoResult] = useState<GeoResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Animação de pulso
  useEffect(() => {
    let up = true
    const t = setInterval(() => {
      setPulse((v) => { const next = up ? v + 0.04 : v - 0.04; if (next >= 1.2) up = false; if (next <= 0.8) up = true; return next })
    }, 50)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!id) return
    getAudiencia(id).then(setAudiencia).catch(console.error)
  }, [id])

  const verificarGeofence = async () => {
    if (!audiencia) return
    if (!isOnline) { setGeoResult({ status: 'offline', mensagem: 'Sem conexão. Check-in será salvo offline.' }); return }
    if (!navigator.geolocation) { setGeoResult({ status: 'gps_indisponivel', mensagem: 'GPS não disponível neste dispositivo.' }); return }

    setGeoResult({ status: 'verificando', mensagem: 'Obtendo localização...' })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = calcDistancia(pos.coords.latitude, pos.coords.longitude, audiencia.latitude, audiencia.longitude)
        const dentro = dist <= audiencia.raioGeofenceMetros
        setGeoResult({
          status: dentro ? 'dentro' : 'fora',
          mensagem: dentro
            ? 'Você está dentro da área da audiência!'
            : `Você está a ${Math.round(dist)}m do local. Aproxime-se (raio: ${audiencia.raioGeofenceMetros}m).`,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          precisao: pos.coords.accuracy,
          distanciaMetros: dist,
        })
      },
      (err) => {
        if (err.code === 1) {
          setGeoResult({ status: 'sem_permissao', mensagem: 'Permissão de localização negada. Acesse as configurações do navegador/dispositivo e habilite o acesso à localização para este site.' })
        } else if (err.code === 3) {
          setGeoResult({ status: 'gps_indisponivel', mensagem: 'Tempo limite excedido ao obter localização. Verifique se o GPS está ativo e tente novamente.' })
        } else {
          setGeoResult({ status: 'gps_indisponivel', mensagem: 'Não foi possível obter sua localização. Verifique se o GPS está habilitado no dispositivo.' })
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    )
  }

  useEffect(() => {
    verificarGeofence()
    timerRef.current = setInterval(verificarGeofence, 8000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [audiencia, isOnline])

  const realizarCheckin = async () => {
    if (!audiencia || !geoResult) return
    setLoading(true)
    try {
      if (!isOnline) {
        navigate('/confirmacao', {
          state: { id: `CHK-OFFLINE-${Date.now()}`, evidenciaId: 'EV-PENDENTE', hashSha256: 'pendente_sincronizacao', modoOffline: true, mensagem: 'Check-in salvo offline. Será sincronizado ao reconectar.' }
        })
        return
      }
      const resp = await registrarCheckin({
        audienciaId: audiencia.id,
        latitude: geoResult.latitude ?? 0,
        longitude: geoResult.longitude ?? 0,
        precisaoMetros: geoResult.precisao ?? 0,
        timestamp: new Date().toISOString(),
        modoOffline: false,
      })
      navigate('/confirmacao', { state: { ...resp } })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const STATUS_CFG = {
    verificando:      { color: COLORS.orange, icon: <MyLocationIcon sx={{ fontSize: 60 }} />,          titulo: 'Verificando localização...', subtitulo: geoResult?.mensagem ?? '' },
    dentro:           { color: COLORS.green,  icon: <CheckCircleOutlineIcon sx={{ fontSize: 60 }} />,  titulo: 'Dentro do Geofence',        subtitulo: geoResult?.mensagem ?? '' },
    fora:             { color: COLORS.red,    icon: <LocationOffOutlinedIcon sx={{ fontSize: 60 }} />, titulo: 'Fora do Geofence',          subtitulo: geoResult?.mensagem ?? '' },
    offline:          { color: COLORS.amber,  icon: <WifiOffIcon sx={{ fontSize: 60 }} />,             titulo: 'Modo Offline',              subtitulo: geoResult?.mensagem ?? '' },
    gps_indisponivel: { color: audiencia?.offlineHabilitado ? COLORS.amber : COLORS.red, icon: <GpsOffIcon sx={{ fontSize: 60 }} />, titulo: audiencia?.offlineHabilitado ? 'GPS Indisponível — Offline' : 'GPS Indisponível', subtitulo: geoResult?.mensagem ?? '' },
    sem_permissao:    { color: audiencia?.offlineHabilitado ? COLORS.amber : COLORS.red, icon: <LocationDisabledIcon sx={{ fontSize: 60 }} />, titulo: audiencia?.offlineHabilitado ? 'Permissão Negada — Offline' : 'Permissão Negada', subtitulo: geoResult?.mensagem ?? '' },
  }

  const cfg = geoResult ? STATUS_CFG[geoResult.status] : STATUS_CFG.verificando
  const semGps = geoResult?.status === 'sem_permissao' || geoResult?.status === 'gps_indisponivel'
  const podeCheckin = geoResult?.status === 'dentro' || geoResult?.status === 'offline' ||
    (semGps && audiencia?.offlineHabilitado === true)

  return (
    <AppShell showNav={false}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700, fontSize: 16, ml: 1 }}>Check-in GPS</Typography>
          {!isOnline && (
            <Chip size="small" icon={<WifiOffIcon />} label="Offline"
              sx={{ background: COLORS.amberMuted, color: COLORS.amber, border: `1px solid ${COLORS.amber}44` }} />
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100svh - 64px)', p: 3, gap: 4 }}>
        {/* Geo Indicator */}
        <Box sx={{
          width: 140, height: 140, borderRadius: '50%',
          background: `${cfg.color}1A`,
          border: `3px solid ${cfg.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: cfg.color,
          transform: geoResult?.status === 'dentro' ? `scale(${pulse})` : 'scale(1)',
          transition: geoResult?.status === 'dentro' ? 'none' : 'transform 0.3s',
        }}>
          {cfg.icon}
        </Box>

        <Box sx={{ textAlign: 'center', maxWidth: 300 }}>
          <Typography sx={{ color: cfg.color, fontWeight: 700, fontSize: 22, mb: 1.5 }}>{cfg.titulo}</Typography>
          <Typography sx={{ color: COLORS.gray3, fontSize: 14, lineHeight: 1.6 }}>{cfg.subtitulo}</Typography>
        </Box>

        {/* Mapa real em tempo real */}
        {audiencia && (
          <Box sx={{ width: '100%' }}>
            <GeoMap
              lat={audiencia.latitude}
              lng={audiencia.longitude}
              raioMetros={audiencia.raioGeofenceMetros}
              titulo={audiencia.nome}
              userLat={geoResult?.latitude}
              userLng={geoResult?.longitude}
              userPrecisao={geoResult?.precisao}
              height={200}
            />
          </Box>
        )}

        {/* Info audiência */}
        {audiencia && (
          <Box sx={{ background: COLORS.surface, borderRadius: 2, p: 2, border: `1px solid ${COLORS.border}`, width: '100%', textAlign: 'center' }}>
            <Typography sx={{ color: COLORS.white, fontWeight: 600, fontSize: 14, mb: 0.5 }}>{audiencia.nome}</Typography>
            <Typography sx={{ color: COLORS.gray3, fontSize: 12 }}>{audiencia.horarioInicio} – {audiencia.horarioFim} · {audiencia.local}</Typography>
            {audiencia.endereco && (
              <Typography sx={{ color: COLORS.gray3, fontSize: 11, mt: 0.5, opacity: 0.75, lineHeight: 1.4 }}>{audiencia.endereco}</Typography>
            )}
          </Box>
        )}

        {/* Ações */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {podeCheckin && (
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} sx={{ color: COLORS.white }} /> : <HowToRegIcon />}
              onClick={realizarCheckin}
              disabled={loading}
            >
              {loading ? 'Registrando...' : geoResult?.status === 'dentro' ? 'Realizar Check-in' : 'Confirmar Presença (sem GPS)'}
            </Button>
          )}
          {!podeCheckin && geoResult?.status === 'sem_permissao' && (
            <Box sx={{ background: COLORS.raised, borderRadius: 2, p: 1.5, border: `1px solid ${COLORS.red}44`, mb: 1 }}>
              <Typography sx={{ color: COLORS.gray3, fontSize: 12, lineHeight: 1.6 }}>
                <strong style={{ color: COLORS.white }}>Chrome/Android:</strong> Toque no ícone de cadeado na barra de endereços → Permissões → Localização → Permitir.{'\n'}
                <strong style={{ color: COLORS.white }}>Safari/iOS:</strong> Ajustes → Safari → Localização → Permitir.
              </Typography>
            </Box>
          )}
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={verificarGeofence}>
            Atualizar Localização
          </Button>
        </Box>

        {geoResult?.latitude && (
          <Typography sx={{ color: COLORS.gray4, fontSize: 11, textAlign: 'center' }}>
            GPS: {geoResult.latitude.toFixed(4)}°, {geoResult.longitude?.toFixed(4)}° · ±{geoResult.precisao?.toFixed(0)}m
          </Typography>
        )}
      </Box>
    </AppShell>
  )
}
