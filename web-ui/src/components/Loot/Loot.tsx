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
import FolderIcon from '@mui/icons-material/Folder';
import ApiStatus from '../ApiStatus';
import { lootService } from '../../api/services/loot';
import type { Loot } from '../../types';

export default function Loot() {
  const { data: loots = [], isLoading, error } = useQuery({
    queryKey: ['loot'],
    queryFn: () => lootService.list(),
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <ApiStatus />
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FolderIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Loot
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
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Loot</Typography>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error">Failed to load loot: {error instanceof Error ? error.message : 'Unknown error'}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <ApiStatus />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FolderIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Loot
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loots.length} item{loots.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', borderRadius: 2 }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(59, 130, 246, 0.06)' }}>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Path</TableCell>
              <TableCell>Host ID</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No loot found. Loot is stored when you run post-exploitation modules that collect files or data.
                </TableCell>
              </TableRow>
            ) : (
              loots.map((loot: Loot) => (
                <TableRow key={loot.id} sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' } }}>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'primary.light' }}>{loot.id}</TableCell>
                  <TableCell>{loot.ltype}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{loot.path}</TableCell>
                  <TableCell>{loot.host_id ?? '—'}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{new Date(loot.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
