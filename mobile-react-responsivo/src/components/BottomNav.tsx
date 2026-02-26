import { useNavigate, useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import EventNoteIcon from '@mui/icons-material/EventNote'
import HistoryIcon from '@mui/icons-material/History'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import Badge from '@mui/material/Badge'
import { useStore } from '@/store'

const TABS = [
  { label: 'Audiências', icon: <EventNoteIcon />, path: '/home' },
  { label: 'Histórico',  icon: <HistoryIcon />,   path: '/historico' },
  { label: 'Alertas',    icon: null,               path: '/notificacoes' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const notificacoes = useStore((s) => s.notificacoes)
  const naoLidas = notificacoes.filter((n) => !n.lida).length

  const currentTab = TABS.findIndex((t) => location.pathname.startsWith(t.path))

  return (
    <BottomNavigation
      value={currentTab === -1 ? false : currentTab}
      onChange={(_, val: number) => navigate(TABS[val].path)}
      sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 100 }}
    >
      {TABS.map((tab) => (
        <BottomNavigationAction
          key={tab.path}
          label={tab.label}
          icon={
            tab.path === '/notificacoes' ? (
              <Badge badgeContent={naoLidas || undefined} color="error" max={9}>
                <NotificationsOutlinedIcon />
              </Badge>
            ) : (
              tab.icon
            )
          }
        />
      ))}
    </BottomNavigation>
  )
}
