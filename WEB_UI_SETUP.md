# Metasploit Framework - Docker Web UI C2 Server Setup

This guide explains how to set up and run the Metasploit Framework with a web-based UI for Command & Control operations. **Everything runs with Docker Compose**—all services (database, Metasploit, web UI, docs, nginx) are started with a single command; no local install of Node, PostgreSQL, or Metasploit is required.

## Architecture

The solution consists of multiple Docker services:

1. **MSF Backend** - Runs Metasploit Framework with REST API (port 8080) and JSON-RPC API (port 8081)
2. **React Web UI** - Modern single-page application (served via nginx on port 80)
3. **Documentation Service** - Jekyll-based documentation server (port 4000)
4. **PostgreSQL Database** - MSF database (port 5432)
5. **Nginx Reverse Proxy** - Routes requests to appropriate services (port 80)

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 80, 4444, 5432, 8080, 8081, 4000 available (or modify in docker-compose.yml)

## Quick Start

Everything runs with Docker Compose. From the project root:

1. **Build and start all services**
   ```bash
   docker compose up -d --build
   ```
   This starts: PostgreSQL, Metasploit (REST + JSON-RPC), React web UI, docs service, and nginx.

2. **Access the web UI**
   - Open http://localhost
   - Click **Connect** (no token needed by default; works like the CLI)

**Optional:** To use a custom API token or session secret, copy the env template and edit:
   ```bash
   cp .env.example .env
   ```
   In `.env` you can set:
   - `MSF_WS_JSON_RPC_API_TOKEN`: optional; leave unset for no authentication
   - `MSF_WS_SESSION_SECRET`: optional; has a default
   - `LHOST`: your host IP for reverse shells

## Services

### Web UI
- **URL**: http://localhost
- **Features**: Dashboard, Sessions, Modules, Console, Hosts, Credentials, Loot, Jobs

### REST API
- **URL**: http://localhost/api/v1
- **Documentation**: http://localhost/api/v1/api-docs
- **Authentication**: Bearer token (set in `.env`)

### JSON-RPC API
- **URL**: http://localhost/rpc
- **Authentication**: Bearer token (set in `.env`)

### Documentation
- **URL**: http://localhost/docs
- **Source**: Served from `docs/` directory

## Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## API Authentication

The web UI works **just like the CLI** - **no authentication needed by default**!

### No Authentication (Recommended - Like CLI)

If you don't set `MSF_WS_JSON_RPC_API_TOKEN`, the services will work without authentication:
- Just click "Connect" on the login page without entering anything
- Works exactly like using `msfconsole` from the command line
- No tokens, no passwords needed

### With Authentication (Optional)

If you want to require authentication (for production/multi-user):

1. Set `MSF_WS_JSON_RPC_API_TOKEN` in `.env` file
2. Use that token in the web UI login page
3. The token must match the environment variable

**Note:** Authentication is only required if:
- `MSF_WS_JSON_RPC_API_TOKEN` is set in the MSF service environment, OR
- Users exist in the MSF database

## Database

The PostgreSQL database is automatically initialized. Data persists in a Docker volume.

To reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Services not starting
- Check logs: `docker-compose logs [service-name]`
- Ensure ports are not in use
- Verify environment variables are set correctly

### API authentication errors
- Verify `MSF_WS_JSON_RPC_API_TOKEN` is set in `.env`
- Check that the token matches what you're using in the UI

### Database connection issues
- Ensure the `db` service is running: `docker-compose ps`
- Check database logs: `docker-compose logs db`

### Web UI not loading
- Verify nginx is running: `docker-compose ps nginx`
- Check nginx logs: `docker-compose logs nginx`
- Ensure web-ui service built successfully

## Stopping Services

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## Production Deployment

For production deployment:

1. Use strong, randomly generated secrets
2. Enable HTTPS (configure SSL certificates in nginx)
3. Set up proper firewall rules
4. Use environment-specific `.env` files
5. Consider using Docker secrets for sensitive data
6. Set up monitoring and logging

## Security Notes

- **Never commit `.env` file** to version control
- Use strong, randomly generated API tokens
- Enable HTTPS in production
- Restrict network access to services
- Regularly update Docker images
- Review and audit API access logs

## Support

For issues and questions:
- Check the main README.md
- Review Metasploit Framework documentation
- Check service logs for errors
