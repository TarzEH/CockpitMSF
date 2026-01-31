import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  IconButton,
  Tooltip,
  Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { modulesService } from '../../api/services/modules';
import ApiStatus from '../ApiStatus';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

interface ModuleInfo {
  fullname: string;
  name: string;
  disclosure_date?: string;
  rank?: string;
  check?: boolean;
  description?: string;
}

export default function Modules() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { data: exploits = [], isLoading: exploitsLoading, error: exploitsError } = useQuery({
    queryKey: ['modules', 'exploits'],
    queryFn: () => modulesService.getExploits(),
    retry: 2,
  });

  const { data: payloads = [], isLoading: payloadsLoading, error: payloadsError } = useQuery({
    queryKey: ['modules', 'payloads'],
    queryFn: () => modulesService.getPayloads(),
    retry: 2,
  });

  const { data: auxiliary = [], isLoading: auxiliaryLoading, error: auxiliaryError } = useQuery({
    queryKey: ['modules', 'auxiliary'],
    queryFn: () => modulesService.getAuxiliary(),
    retry: 2,
  });

  const { data: post = [], isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['modules', 'post'],
    queryFn: () => modulesService.getPost(),
    retry: 2,
  });

  const getCurrentModules = (): string[] => {
    switch (tabValue) {
      case 0:
        return Array.isArray(exploits) ? exploits : [];
      case 1:
        return Array.isArray(payloads) ? payloads : [];
      case 2:
        return Array.isArray(auxiliary) ? auxiliary : [];
      case 3:
        return Array.isArray(post) ? post : [];
      default:
        return [];
    }
  };

  const isLoading = (): boolean => {
    switch (tabValue) {
      case 0:
        return exploitsLoading;
      case 1:
        return payloadsLoading;
      case 2:
        return auxiliaryLoading;
      case 3:
        return postLoading;
      default:
        return false;
    }
  };

  // Organize modules by path (like CLI tree structure)
  const organizedModules = useMemo(() => {
    const modules = getCurrentModules();
    const tree: Record<string, string[]> = {};

    modules.forEach((module: string) => {
      const parts = module.split('/');
      if (parts.length >= 2) {
        const category = parts[0];
        if (!tree[category]) {
          tree[category] = [];
        }
        tree[category].push(module);
      } else {
        if (!tree['_root']) {
          tree['_root'] = [];
        }
        tree['_root'].push(module);
      }
    });

    return tree;
  }, [tabValue, exploits, payloads, auxiliary, post]);

  const filteredModules = useMemo(() => {
    if (!searchQuery) {
      return organizedModules;
    }

    const filtered: Record<string, string[]> = {};
    const query = searchQuery.toLowerCase();

    Object.entries(organizedModules).forEach(([category, modules]) => {
      const matching = modules.filter((module: string) =>
        module.toLowerCase().includes(query)
      );
      if (matching.length > 0) {
        filtered[category] = matching;
      }
    });

    return filtered;
  }, [organizedModules, searchQuery]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedModules(newExpanded);
  };

  const moduleTypeLabels = ['Exploits', 'Payloads', 'Auxiliary', 'Post'];
  const moduleCounts = [
    Array.isArray(exploits) ? exploits.length : 0,
    Array.isArray(payloads) ? payloads.length : 0,
    Array.isArray(auxiliary) ? auxiliary.length : 0,
    Array.isArray(post) ? post.length : 0,
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <ApiStatus />
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em', color: 'text.primary' }}>
          Modules
        </Typography>
        <Chip
          label={`${moduleCounts[tabValue]} ${moduleTypeLabels[tabValue]}`}
          size="small"
          color="primary"
          sx={{ fontWeight: 600, fontSize: '0.8rem' }}
        />
      </Box>

      <TextField
        fullWidth
        placeholder="Search modules (e.g., 'windows', 'linux', 'http')..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'primary.main', opacity: 0.9 }} />
            </InputAdornment>
          ),
        }}
      />

      <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => {
            setTabValue(newValue);
            setSearchQuery('');
            setExpandedModules(new Set());
          }}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTab-root': { minHeight: 56 },
          }}
        >
          {moduleTypeLabels.map((label, index) => (
            <Tab
              key={label}
              label={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <Chip
                    label={moduleCounts[index]}
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>

        {moduleTypeLabels.map((label, index) => {
          const errors = [exploitsError, payloadsError, auxiliaryError, postError];
          const currentError = errors[index];
          
          return (
            <TabPanel key={label} value={tabValue} index={index}>
              {              currentError ? (
                <Box p={3} textAlign="center">
                  <Typography color="error" sx={{ mb: 2, fontWeight: 600 }}>
                    Error loading {label.toLowerCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentError instanceof Error ? currentError.message : 'Unknown error'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.8rem' }}>
                    Ensure JSON-RPC API is accessible and your API token is set.
                  </Typography>
                </Box>
              ) : isLoading() ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress color="primary" />
                </Box>
              ) : Object.keys(filteredModules).length === 0 ? (
                <Box p={3} textAlign="center">
                  <Typography color="text.secondary">
                    {searchQuery ? 'No modules found matching your search' : 'No modules available'}
                  </Typography>
                </Box>
              ) : (
              <Box>
                {Object.entries(filteredModules)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([category, modules]) => (
                    <Box key={category} sx={{ mb: 2 }}>
                      <Box
                        onClick={() => toggleCategory(category)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          cursor: 'pointer',
                          bgcolor: 'rgba(59, 130, 246, 0.08)',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': {
                            bgcolor: 'rgba(59, 130, 246, 0.14)',
                          },
                        }}
                      >
                        <IconButton size="small" color="primary">
                          {expandedModules.has(category) ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.light', flexGrow: 1 }}>
                          {category === '_root' ? 'Root' : category}
                        </Typography>
                        <Chip label={modules.length} size="small" color="primary" sx={{ fontWeight: 600 }} />
                      </Box>
                      <Collapse in={expandedModules.has(category)}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'rgba(59, 130, 246, 0.06)' }}>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>#</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Module Path</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {modules
                                .sort()
                                .map((module: string, idx: number) => (
                                  <TableRow
                                    key={module}
                                    sx={{
                                      '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' },
                                      cursor: 'pointer',
                                    }}
                                    onClick={async () => {
                                      try {
                                        const moduleType = tabValue === 0 ? 'exploit' : tabValue === 1 ? 'payload' : tabValue === 2 ? 'auxiliary' : 'post';
                                        const info = await modulesService.getInfo(moduleType, module);
                                        console.log('Module info:', info);
                                        // TODO: Open module configuration dialog
                                      } catch (error) {
                                        console.error('Error loading module info:', error);
                                      }
                                    }}
                                  >
                                    <TableCell sx={{ fontFamily: 'monospace', color: 'primary.light' }}>{idx + 1}</TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace' }}>
                                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                        {module}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip title="Use this module">
                                        <Chip
                                          label="Use"
                                          size="small"
                                          color="primary"
                                          sx={{ fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                              const moduleType = tabValue === 0 ? 'exploit' : tabValue === 1 ? 'payload' : tabValue === 2 ? 'auxiliary' : 'post';
                                              const info = await modulesService.getInfo(moduleType, module);
                                              console.log('Use module:', module, info);
                                              // TODO: Navigate to module configuration page
                                            } catch (error) {
                                              console.error('Error loading module:', error);
                                            }
                                          }}
                                        />
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Collapse>
                    </Box>
                  ))}
              </Box>
              )}
            </TabPanel>
          );
        })}
      </Paper>
    </Box>
  );
}
