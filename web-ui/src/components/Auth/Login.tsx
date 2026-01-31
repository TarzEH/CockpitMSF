import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { authService } from '../../api/auth';

export default function Login() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // If no token provided, try to connect without authentication (like CLI)
      const apiToken = token?.trim() || import.meta.env.VITE_API_TOKEN;

      if (apiToken) {
        authService.setApiToken(apiToken);
      } else {
        authService.clearApiToken();
      }

      // Test connection: verify both REST and RPC work (token is now synced to both clients)
      try {
        const { restClient } = await import('../../api/restClient');
        const { rpcClient } = await import('../../api/rpcClient');
        await restClient.get('/msf/version');
        await rpcClient.coreVersion();
      } catch (testError: any) {
        if (testError?.response?.status === 401) {
          throw new Error('Authentication required. Please enter your API token or set MSF_WS_JSON_RPC_API_TOKEN.');
        }
        console.warn('Initial API test failed, but continuing:', testError);
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Connection failed. Check if MSF services are running.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0f172a 0%, #020617 50%)',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          border: '1px solid rgba(59, 130, 246, 0.15)',
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Cockpit
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Metasploit Command & Control
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="API token (optional)"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            helperText="Leave empty for CLI-style access"
            autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? 'Connecting…' : 'Connect'}
          </Button>
          <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 1 }}>
            No token required when auth is disabled
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
