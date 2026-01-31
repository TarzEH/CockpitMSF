import { createTheme } from '@mui/material/styles';

// Blue dark mode • AI-style • React-friendly
const cockpitTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#fff',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      disabled: '#64748b',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      letterSpacing: '0.01em',
    },
    body2: {
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.2)',
    '0 2px 8px rgba(0,0,0,0.25)',
    '0 4px 16px rgba(0,0,0,0.3)',
    '0 8px 24px rgba(0,0,0,0.35)',
    '0 12px 32px rgba(0,0,0,0.4)',
    '0 16px 40px rgba(0,0,0,0.4)',
    '0 20px 48px rgba(0,0,0,0.45)',
    '0 24px 56px rgba(0,0,0,0.45)',
    '0 28px 64px rgba(0,0,0,0.5)',
    '0 32px 72px rgba(0,0,0,0.5)',
    '0 36px 80px rgba(0,0,0,0.55)',
    '0 40px 88px rgba(0,0,0,0.55)',
    '0 44px 96px rgba(0,0,0,0.6)',
    '0 48px 104px rgba(0,0,0,0.6)',
    '0 52px 112px rgba(0,0,0,0.65)',
    '0 56px 120px rgba(0,0,0,0.65)',
    '0 60px 128px rgba(0,0,0,0.7)',
    '0 64px 136px rgba(0,0,0,0.7)',
    '0 68px 144px rgba(0,0,0,0.75)',
    '0 72px 152px rgba(0,0,0,0.75)',
    '0 76px 160px rgba(0,0,0,0.8)',
    '0 80px 168px rgba(0,0,0,0.8)',
    '0 84px 176px rgba(0,0,0,0.85)',
    '0 88px 184px rgba(0,0,0,0.9)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(59, 130, 246, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
        contained: {
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.45)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(148, 163, 184, 0.08)',
        },
        head: {
          fontWeight: 600,
          color: '#94a3b8',
          letterSpacing: '0.02em',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': {
            color: '#60a5fa',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': {
              borderColor: 'rgba(59, 130, 246, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(59, 130, 246, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3b82f6',
              borderWidth: '1px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&.Mui-selected': {
            background: 'rgba(59, 130, 246, 0.12)',
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.18)',
            },
          },
        },
      },
    },
  },
});

export { cockpitTheme };
