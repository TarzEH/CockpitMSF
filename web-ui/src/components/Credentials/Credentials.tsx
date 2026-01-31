import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ApiStatus from '../ApiStatus';
import { credentialsService } from '../../api/services/credentials';
import { Credential } from '../../types';

export default function Credentials() {
  const { data: credentials = [], isLoading, error } = useQuery({
    queryKey: ['credentials'],
    queryFn: () => credentialsService.list(),
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <ApiStatus />
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <VpnKeyIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Credentials
          </Typography>
        </Box>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 1 }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" height={40} sx={{ mb: 1, borderRadius: 1 }} />
          ))}
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <ApiStatus />
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Credentials</Typography>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error">Failed to load credentials: {error instanceof Error ? error.message : 'Unknown error'}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <ApiStatus />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <VpnKeyIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Credentials
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {credentials.length} credential{credentials.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', borderRadius: 2 }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(59, 130, 246, 0.06)' }}>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Realm</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credentials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No credentials found. Credentials are stored when you run modules that capture them.
                </TableCell>
              </TableRow>
            ) : (
              credentials.map((cred: Credential) => (
                <TableRow key={cred.id} sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' } }}>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'primary.light' }}>{cred.id}</TableCell>
                  <TableCell>{cred.username}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{cred.password || cred.private_data || '—'}</TableCell>
                  <TableCell>{cred.realm || '—'}</TableCell>
                  <TableCell>{cred.private_type || '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
