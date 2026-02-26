import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import BottomNav from './BottomNav'
import { useStore } from '@/store'

interface Props { children: React.ReactNode; showNav?: boolean }

export default function AppShell({ children, showNav = true }: Props) {
  const error = useStore((s) => s.error)
  const setError = useStore((s) => s.setError)

  return (
    <Box sx={{ minHeight: '100svh', pb: showNav ? '80px' : 0, background: '#0C1021' }}>
      {children}
      {showNav && <BottomNav />}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: showNav ? '80px' : 0 }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
