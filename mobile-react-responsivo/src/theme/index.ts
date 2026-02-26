import { createTheme, alpha } from '@mui/material/styles'

// ─── Design Tokens — idênticos ao Flutter AppColors ───────────────────────
export const COLORS = {
  bg:           '#0C1021',
  surface:      '#161D2E',
  raised:       '#1E2A3A',
  border:       '#374155',

  orange:       '#FF6600',
  orangeMuted:  'rgba(255,102,0,0.15)',
  orangeBorder: 'rgba(255,102,0,0.35)',

  white:        '#FFFFFF',
  gray1:        '#E2E8F0',
  gray3:        '#94A3B8',
  gray4:        '#64748B',

  green:        '#4ADE80',
  greenMuted:   'rgba(74,222,128,0.15)',
  amber:        '#FBBF24',
  amberMuted:   'rgba(251,191,36,0.15)',
  red:          '#F87171',
  redMuted:     'rgba(248,113,113,0.15)',
  blue:         '#3B82F6',
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: COLORS.orange, contrastText: '#fff' },
    secondary: { main: COLORS.blue },
    background: { default: COLORS.bg, paper: COLORS.surface },
    text: {
      primary:   COLORS.white,
      secondary: COLORS.gray3,
      disabled:  COLORS.gray4,
    },
    error:   { main: COLORS.red },
    warning: { main: COLORS.amber },
    success: { main: COLORS.green },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: COLORS.bg, color: COLORS.white },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
          textTransform: 'none',
          fontSize: 15,
          padding: '14px 20px',
          minHeight: 52,
        },
        contained: {
          background: COLORS.orange,
          color: '#fff',
          '&:hover': { background: '#e55c00' },
          '&.Mui-disabled': { background: alpha(COLORS.orange, 0.3), color: alpha('#fff', 0.5) },
        },
        outlined: {
          borderColor: COLORS.orangeBorder,
          color: COLORS.orange,
          '&:hover': { borderColor: COLORS.orange, background: COLORS.orangeMuted },
        },
      },
      defaultProps: { disableElevation: true, fullWidth: true },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: COLORS.raised,
            borderRadius: 10,
            '& fieldset': { borderColor: COLORS.border },
            '&:hover fieldset': { borderColor: COLORS.gray4 },
            '&.Mui-focused fieldset': { borderColor: COLORS.orange },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: COLORS.orange },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: COLORS.surface,
          borderBottom: `1px solid ${COLORS.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: COLORS.surface,
          borderTop: `1px solid ${COLORS.border}`,
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: COLORS.gray4,
          '&.Mui-selected': { color: COLORS.orange },
          minWidth: 48,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: 11 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6, background: COLORS.raised },
        bar: { borderRadius: 4, background: COLORS.orange },
      },
    },
    MuiCircularProgress: {
      defaultProps: { style: { color: COLORS.orange } },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: COLORS.border },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { color: COLORS.gray3, '&:hover': { color: COLORS.white } },
      },
    },
  },
})
