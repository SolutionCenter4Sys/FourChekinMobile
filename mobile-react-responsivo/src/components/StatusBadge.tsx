import Chip from '@mui/material/Chip'
import type { AudienciaStatus } from '@/types'
import { COLORS } from '@/theme'

const STATUS_MAP: Record<AudienciaStatus, { label: string; color: string; bg: string }> = {
  agendada:    { label: 'Agendada',     color: COLORS.blue,   bg: 'rgba(59,130,246,0.15)' },
  em_andamento:{ label: 'Em andamento', color: COLORS.orange, bg: COLORS.orangeMuted },
  encerrada:   { label: 'Encerrada',    color: COLORS.green,  bg: COLORS.greenMuted },
  cancelada:   { label: 'Cancelada',    color: COLORS.red,    bg: COLORS.redMuted },
}

interface Props { status: AudienciaStatus; size?: 'small' | 'medium' }

export default function StatusBadge({ status, size = 'small' }: Props) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.agendada
  return (
    <Chip
      label={cfg.label}
      size={size}
      sx={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}33`,
        fontWeight: 700,
        fontSize: size === 'small' ? 10 : 12,
        height: size === 'small' ? 22 : 28,
      }}
    />
  )
}
