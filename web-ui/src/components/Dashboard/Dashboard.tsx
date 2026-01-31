import { useQuery } from '@tanstack/react-query';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { sessionsService } from '../../api/services/sessions';
import { hostsService } from '../../api/services/hosts';
import { jobsService } from '../../api/services/jobs';
import { workspacesService } from '../../api/services/workspaces';
import ApiStatus from '../ApiStatus';

function StatCard({ title, value, loading }: { title: string; value: number | string; loading?: boolean }) {
  return (
    <Paper
      sx={{
        p: 3,
        textAlign: 'center',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(30, 41, 59, 0.9) 100%)',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(59, 130, 246, 0.3)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={40} sx={{ color: 'primary.main' }} />
      ) : (
        <Typography variant="h3" component="div" sx={{ color: 'primary.light', fontWeight: 700, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
      )}
    </Paper>
  );
}

export default function Dashboard() {
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => sessionsService.list(),
  });

  const { data: hosts = [], isLoading: hostsLoading } = useQuery({
    queryKey: ['hosts'],
    queryFn: () => hostsService.list(),
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobsService.list(),
  });

  const { data: workspaces = [], isLoading: workspacesLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspacesService.list(),
  });

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <ApiStatus />
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 3, fontWeight: 600, letterSpacing: '-0.02em' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Sessions" value={sessions.length} loading={sessionsLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Hosts" value={hosts.length} loading={hostsLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Background Jobs" value={jobs.length} loading={jobsLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Workspaces" value={workspaces.length} loading={workspacesLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
