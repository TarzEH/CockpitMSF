# Metasploit Framework Web UI

Modern React-based web interface for Metasploit Framework Command & Control operations.

## Features

- **Dashboard**: Overview of sessions, hosts, jobs, and workspaces
- **Sessions Management**: View and manage active sessions
- **Modules Browser**: Search and browse exploits, payloads, auxiliary, and post modules
- **Console Interface**: Web-based msfconsole terminal
- **Hosts & Services**: View discovered hosts and services
- **Credentials**: Manage captured credentials
- **Loot**: View collected loot
- **Jobs**: Manage background jobs

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
cd web-ui
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Technology Stack

- **React 18** with TypeScript
- **Material-UI** for components
- **React Router** for navigation
- **React Query** for data fetching
- **Axios** for HTTP requests
- **xterm.js** for terminal emulation
- **Vite** for build tooling

## API Integration

The web UI integrates with:
- **REST API** (`/api/v1/*`) for CRUD operations
- **JSON-RPC API** (`/rpc`) for console and module operations

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for REST API (default: `/api`)
- `VITE_RPC_BASE_URL`: Base URL for JSON-RPC API (default: `/rpc`)
- `VITE_API_TOKEN`: API token for authentication (optional, can be set at login)
