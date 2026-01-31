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
  CircularProgress,
  Skeleton,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import ApiStatus from '../ApiStatus';
import { hostsService } from '../../api/services/hosts';
import { Host } from '../../types';

export default function Hosts() {
  const { data: hosts = [], isLoading, error } = useQuery({
    queryKey: ['hosts'],
    queryFn: () => hostsService.list(),
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <ApiStatus />
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <StorageIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Hosts
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
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Hosts</Typography>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error">Failed to load hosts: {error instanceof Error ? error.message : 'Unknown error'}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <ApiStatus />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <StorageIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Hosts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hosts.length} host{hosts.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', borderRadius: 2 }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(59, 130, 246, 0.06)' }}>
              <TableCell>ID</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>MAC</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>OS</TableCell>
              <TableCell>Arch</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No hosts found. Hosts appear here when you run modules that report them.
                </TableCell>
              </TableRow>
            ) : (
              hosts.map((host: Host) => (
                <TableRow key={host.id} sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' } }}>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'primary.light' }}>{host.id}</TableCell>
                  <TableCell>{host.address}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{host.mac || '—'}</TableCell>
                  <TableCell>{host.name || '—'}</TableCell>
                  <TableCell>{host.os_name || '—'}</TableCell>
                  <TableCell>{host.arch || '—'}</TableCell>
                  <TableCell>{host.state || '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
