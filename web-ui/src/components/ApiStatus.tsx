import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Chip, Typography } from '@mui/material';
import { restClient } from '../api/restClient';
import { rpcClient } from '../api/rpcClient';

export default function ApiStatus() {
  const { error: restError } = useQuery({
    queryKey: ['api-health'],
    queryFn: async () => restClient.get('/msf/version'),
    retry: false,
    refetchInterval: 30000,
  });

  const { error: rpcError } = useQuery({
    queryKey: ['rpc-health'],
    queryFn: async () => {
      await rpcClient.coreVersion();
      return true;
    },
    retry: false,
    refetchInterval: 30000,
  });

  const rpcOk = !rpcError;
  const restOk = !restError;

  // Only show blocking error when both APIs fail (RPC is primary for Console/Modules/Jobs)
  if (!rpcOk && !restOk) {
    const errorMsg = `REST: ${restError instanceof Error ? restError.message : 'unavailable'} · RPC: ${rpcError instanceof Error ? rpcError.message : 'unavailable'}`;
    return (
      <Alert
        severity="error"
        sx={{
          mb: 2,
          borderRadius: 2,
          border: '1px solid rgba(239, 68, 68, 0.3)',
          '& .MuiAlert-message': { width: '100%' },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Connection failed
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.95 }}>
          {errorMsg}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
          Ensure MSF services are running (ports 8080, 8081). Set API token if auth is enabled.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
      <Chip
        label={rpcOk ? 'RPC OK' : 'RPC Error'}
        size="small"
        sx={{
          bgcolor: rpcOk ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          color: rpcOk ? '#60a5fa' : '#ef4444',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      />
      <Chip
        label={restOk ? 'REST OK' : 'REST Warning'}
        size="small"
        sx={{
          bgcolor: restOk ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
          color: restOk ? '#60a5fa' : '#f59e0b',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}
      />
      {!restOk && rpcOk && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Hosts, Credentials &amp; Loot use REST — reconnecting…
        </Typography>
      )}
    </Box>
  );
}
