import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: '#0a0e27',
            p: 3,
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 600,
              border: '1px solid rgba(255, 23, 68, 0.3)',
              bgcolor: '#1a1f3a',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontFamily: 'monospace', color: '#ff1744', mb: 2 }}
            >
              🎯 COCKPIT ERROR
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#e0e0e0', mb: 2 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleReset}
              sx={{
                mt: 2,
                bgcolor: '#ff1744',
                '&:hover': {
                  bgcolor: '#c4001d',
                },
              }}
            >
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
