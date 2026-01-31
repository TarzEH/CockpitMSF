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
  Chip,
  Skeleton,
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import ApiStatus from '../ApiStatus';
import { sessionsService } from '../../api/services/sessions';
import { Session } from '../../types';

export default function Sessions() {
  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => sessionsService.list(),
    refetchInterval: 5000,
    retry: 2,
  });

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <ApiStatus />
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <ComputerIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Sessions
          </Typography>
        </Box>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 1 }} />
          {[1, 2, 3, 4].map((i) => (
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
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <ComputerIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Sessions
          </Typography>
        </Box>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error">Error loading sessions: {error instanceof Error ? error.message : 'Unknown error'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Ensure the JSON-RPC API is reachable and your API token is set.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <ApiStatus />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ComputerIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Sessions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', borderRadius: 2 }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(59, 130, 246, 0.06)' }}>
              <TableCell>ID</TableCell>
              <TableCell>Host</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Arch</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No active sessions. Exploit a target from the Console or Modules to see sessions here.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session: Session, index: number) => (
                <TableRow key={session?.id ?? index} sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' } }}>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'primary.light' }}>{session?.id ?? '—'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{session?.host ?? '—'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{session?.port ?? '—'}</TableCell>
                  <TableCell>{session?.type ?? '—'}</TableCell>
                  <TableCell>{session?.platform ?? '—'}</TableCell>
                  <TableCell>{session?.arch ?? '—'}</TableCell>
                  <TableCell>{session?.desc ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={session?.closed_at ? 'Closed' : 'Active'}
                      size="small"
                      color={session?.closed_at ? 'default' : 'success'}
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
