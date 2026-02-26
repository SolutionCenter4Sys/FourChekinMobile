import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { COLORS } from '@/theme'

// Fix para os ícones do Leaflet quebrarem com Vite/Webpack
import L from 'leaflet'
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export interface GeoMapProps {
  /** Centro do mapa / local da audiência */
  lat: number
  lng: number
  /** Raio do geofence em metros */
  raioMetros?: number
  /** Posição atual do usuário (GPS real) */
  userLat?: number
  userLng?: number
  /** Precisão GPS do usuário em metros */
  userPrecisao?: number
  /** Altura do mapa */
  height?: number | string
  /** Título exibido no pin da audiência */
  titulo?: string
}

export default function GeoMap({
  lat, lng, raioMetros = 200,
  userLat, userLng, userPrecisao,
  height = 240,
  titulo = 'Local da Audiência',
}: GeoMapProps) {
  const mapRef  = useRef<L.Map | null>(null)
  const divRef  = useRef<HTMLDivElement>(null)
  const circleRef  = useRef<L.Circle | null>(null)
  const userMarkerRef = useRef<L.CircleMarker | null>(null)
  const userAccRef    = useRef<L.Circle | null>(null)

  // ── Inicialização do mapa ────────────────────────────────────────────────
  useEffect(() => {
    if (!divRef.current || mapRef.current) return

    const map = L.map(divRef.current, {
      center: [lat, lng],
      zoom: 17,
      zoomControl: true,
      attributionControl: false,
    })

    // Tile layer — OpenStreetMap (gratuito, sem API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    // Atribuição discreta
    L.control.attribution({ prefix: false, position: 'bottomright' })
      .addAttribution('© <a href="https://openstreetmap.org">OpenStreetMap</a>')
      .addTo(map)

    // Pino da audiência (laranja)
    const audienciaIcon = L.divIcon({
      className: '',
      html: `<div style="
        background:#FF6600;
        border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        width:28px;height:28px;
        box-shadow:0 2px 8px rgba(0,0,0,0.5);
      "></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -32],
    })

    L.marker([lat, lng], { icon: audienciaIcon })
      .addTo(map)
      .bindPopup(`<b style="font-family:Inter,sans-serif">${titulo}</b>`)
      .openPopup()

    // Círculo do geofence
    circleRef.current = L.circle([lat, lng], {
      radius: raioMetros,
      color: '#FF6600',
      fillColor: '#FF6600',
      fillOpacity: 0.08,
      weight: 2,
      dashArray: '6 4',
    }).addTo(map)

    // Legenda do raio
    L.marker([lat, lng], {
      icon: L.divIcon({
        className: '',
        html: `<span style="
          background:rgba(12,16,33,0.85);
          color:#FF6600;
          font-size:11px;
          font-family:Inter,sans-serif;
          font-weight:700;
          padding:2px 6px;
          border-radius:4px;
          white-space:nowrap;
          border:1px solid rgba(255,102,0,0.4);
        ">⬤ Geofence ${raioMetros}m</span>`,
        iconAnchor: [-8, -raioMetros * 0.3],
      }),
      interactive: false,
    }).addTo(map)

    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Atualizar posição do usuário em tempo real ───────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remover marcadores antigos
    userMarkerRef.current?.remove()
    userAccRef.current?.remove()

    if (userLat !== undefined && userLng !== undefined) {
      // Círculo de precisão GPS
      if (userPrecisao && userPrecisao > 0) {
        userAccRef.current = L.circle([userLat, userLng], {
          radius: userPrecisao,
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          weight: 1,
        }).addTo(map)
      }

      // Pino do usuário (azul)
      userMarkerRef.current = L.circleMarker([userLat, userLng], {
        radius: 10,
        color: '#fff',
        fillColor: '#3B82F6',
        fillOpacity: 1,
        weight: 3,
      }).addTo(map)
        .bindPopup('<b style="font-family:Inter,sans-serif">Você está aqui</b>')

      // Linha entre usuário e audiência
      const linha = L.polyline([[userLat, userLng], [lat, lng]], {
        color: '#64748B',
        weight: 1.5,
        dashArray: '4 4',
      }).addTo(map)

      // Ajustar zoom para mostrar os dois pontos
      const bounds = L.latLngBounds([[userLat, userLng], [lat, lng]])
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 })

      return () => { linha.remove() }
    }
  }, [userLat, userLng, userPrecisao, lat, lng])

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}`, position: 'relative' }}>
      <div ref={divRef} style={{ height, width: '100%' }} />
      {/* Badge "Abrir no Google Maps" */}
      <Box
        component="a"
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'absolute', bottom: 8, left: 8, zIndex: 1000,
          background: 'rgba(12,16,33,0.9)',
          border: `1px solid ${COLORS.border}`,
          color: COLORS.white, fontSize: 11, fontFamily: 'Inter,sans-serif',
          fontWeight: 600, borderRadius: 1, px: 1, py: 0.5,
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 0.5,
          '&:hover': { background: COLORS.raised },
        }}
      >
        🗺️ Abrir no Google Maps
      </Box>
      {/* Label de precisão */}
      {userPrecisao !== undefined && (
        <Box sx={{
          position: 'absolute', top: 8, right: 8, zIndex: 1000,
          background: 'rgba(12,16,33,0.9)', border: `1px solid ${COLORS.border}`,
          borderRadius: 1, px: 1, py: 0.5,
        }}>
          <Typography sx={{ color: COLORS.blue, fontSize: 11, fontWeight: 600 }}>
            GPS ±{Math.round(userPrecisao)}m
          </Typography>
        </Box>
      )}
    </Box>
  )
}
