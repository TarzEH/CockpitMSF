import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  IconButton,
  Skeleton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import ApiStatus from '../ApiStatus';
import { jobsService } from '../../api/services/jobs';
import { Job } from '../../types';

export default function Jobs() {
  const queryClient = useQueryClient();
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsService.list(),
    refetchInterval: 5000,
  });

  const stopJobMutation = useMutation({
    mutationFn: (id: number) => jobsService.stop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const handleStop = useCallback((id: number) => {
    stopJobMutation.mutate(id);
  }, [stopJobMutation]);

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <ApiStatus />
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <WorkIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Background Jobs
          </Typography>
        </Box>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 1 }} />
          {[1, 2, 3].map((i) => (
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
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>Background Jobs</Typography>
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'error.main' }}>
          <Typography color="error">Failed to load jobs: {error instanceof Error ? error.message : 'Unknown error'}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <ApiStatus />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <WorkIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Background Jobs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden', borderRadius: 2 }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(59, 130, 246, 0.06)' }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>URI Path</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No background jobs. Start handlers or exploits from the Console or Modules to see jobs here.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job: Job) => (
                <TableRow key={job.id} sx={{ '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.04)' } }}>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'primary.light' }}>{job.id}</TableCell>
                  <TableCell>{job.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{job.uri_path || '—'}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{new Date(job.start_time * 1000).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Stop job">
                      <IconButton size="small" onClick={() => handleStop(job.id)} color="error" disabled={stopJobMutation.isPending}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
