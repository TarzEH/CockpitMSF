import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { rpcClient } from '../../api/rpcClient';

// Blue dark-mode terminal theme aligned with cockpit
const terminalTheme = {
  background: '#0f172a',
  foreground: '#94a3b8',
  cursor: '#60a5fa',
  cursorAccent: '#0f172a',
  selection: 'rgba(59, 130, 246, 0.3)',
  black: '#1e293b',
  red: '#ef4444',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6',
  magenta: '#a855f7',
  cyan: '#06b6d4',
  white: '#f1f5f9',
  brightBlack: '#64748b',
  brightRed: '#f87171',
  brightGreen: '#4ade80',
  brightYellow: '#facc15',
  brightBlue: '#60a5fa',
  brightMagenta: '#c084fc',
  brightCyan: '#22d3ee',
  brightWhite: '#f8fafc',
};

export default function Console() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const consoleId = useRef<number | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      theme: terminalTheme,
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 14,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();

    terminal.current = term;
    fitAddon.current = fit;

    rpcClient.consoleCreate().then((result) => {
      consoleId.current = result.id;
      term.writeln('Metasploit Console initialized');
      term.writeln(`Console ID: ${result.id}`);
      term.write(result.prompt || 'msf > ');

      pollIntervalRef.current = setInterval(async () => {
        if (consoleId.current !== null) {
          try {
            const output = await rpcClient.consoleRead(consoleId.current);
            if (output.data) term.write(output.data);
          } catch (err) {
            console.error('Error reading console:', err);
          }
        }
      }, 500);
    });

    const handleResize = () => fitAddon.current?.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (consoleId.current !== null) rpcClient.consoleDestroy(consoleId.current).catch(console.error);
      term.dispose();
    };
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!consoleId.current || !input.trim()) return;
      try {
        await rpcClient.consoleWrite(consoleId.current, input + '\n');
        terminal.current?.write(input + '\r\n');
        setInput('');
      } catch (err) {
        console.error('Error writing to console:', err);
      }
    },
    [input]
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TerminalIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Console
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Metasploit Framework shell (JSON-RPC)
        </Typography>
      </Box>
      <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        <Box
          ref={terminalRef}
          sx={{
            width: '100%',
            height: 500,
            bgcolor: 'background.default',
            borderRadius: 1,
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        />
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command (e.g. help, use exploit/...)..."
            sx={{ flexGrow: 1 }}
          />
          <Button type="submit" variant="contained">
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
