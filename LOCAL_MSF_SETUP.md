# Using Local Metasploit with Web UI

This guide explains how to use your local Metasploit installation (from Kali) with the Docker-based web UI.

## Prerequisites

- Metasploit Framework installed locally (e.g., on Kali Linux)
- PostgreSQL database running and configured for MSF
- Docker and Docker Compose installed
- Ports 8080 and 8081 available for MSF web services

## Setup Steps

### 1. Start Local MSF Web Services

From your Metasploit Framework directory, run:

```bash
./scripts/start-local-msf-services.sh
```

Or manually:

```bash
# Set environment variables (optional - defaults will be used)
export DATABASE_URL="postgres://postgres@localhost:5432/msf?pool=200&timeout=5"
export MSF_WS_SESSION_SECRET=$(openssl rand -hex 32)
# Leave MSF_WS_JSON_RPC_API_TOKEN unset to work without authentication (like CLI)

# Start REST API
thin --rackup msf-ws.ru --address 0.0.0.0 --port 8080 --environment production --tag msf-ws start &

# Start JSON-RPC API
thin --rackup msf-json-rpc.ru --address 0.0.0.0 --port 8081 --environment production --tag msf-json-rpc start &
```

**Important**: The services must bind to `0.0.0.0` (not `127.0.0.1`) so Docker containers can access them.

### 2. Verify Services Are Running

Check that the services are listening:

```bash
netstat -tlnp | grep -E '8080|8081'
# or
ss -tlnp | grep -E '8080|8081'
```

You should see:
- Port 8080 (REST API)
- Port 8081 (JSON-RPC API)

### 3. Start Docker Services (Web UI Only)

Start only the web UI and supporting services (not the MSF container):

```bash
docker-compose up -d web-ui docs-service nginx
```

Or if you want the database too:

```bash
docker-compose up -d db web-ui docs-service nginx
```

### 4. Access the Web UI

Open your browser and navigate to:
- **Direct access**: `http://localhost:3000`
- **Via nginx**: `http://localhost`

### 5. Connect Without Authentication

If you didn't set `MSF_WS_JSON_RPC_API_TOKEN`, just click "Connect" without entering anything (works like CLI).

## Troubleshooting

### Services Not Accessible from Docker

If Docker containers can't reach `host.docker.internal:8080` or `host.docker.internal:8081`:

**On Linux**: You may need to use the host's IP address instead. Find it with:
```bash
ip addr show docker0 | grep inet
```

Then update `web-ui/Dockerfile` and `nginx/nginx.conf` to use that IP instead of `host.docker.internal`.

**Alternative**: Use `network_mode: "host"` in docker-compose.yml for web-ui (Linux only).

### Connection Refused Errors

1. Verify MSF services are running: `ps aux | grep thin`
2. Check they're bound to 0.0.0.0: `netstat -tlnp | grep 808`
3. Check firewall rules allow connections
4. Verify database is accessible: `msfconsole -x "db_status"`

### Everything Shows 0

- Check browser console for errors
- Verify MSF services are running and accessible
- Check that database has data: `msfconsole -x "hosts; exit"`

## Architecture

```
Local Metasploit (Kali)
├── REST API (localhost:8080)
├── JSON-RPC API (localhost:8081)
└── Database (PostgreSQL)

Docker Containers
├── web-ui → proxies to host.docker.internal:8080/8081
├── nginx → proxies to host.docker.internal:8080/8081
└── docs-service
```

## Stopping Services

1. Stop Docker services: `docker-compose down`
2. Stop MSF web services: `pkill -f "thin.*msf"` or find PIDs and kill them
