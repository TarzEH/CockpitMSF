#!/bin/bash
# Script to start MSF web services locally (without Docker)
# Use this if you have MSF installed locally and want to run the web UI against it

# Set these environment variables or modify the script
export DATABASE_URL=${DATABASE_URL:-"postgres://postgres@localhost:5432/msf?pool=200&timeout=5"}
export MSF_WS_SESSION_SECRET=${MSF_WS_SESSION_SECRET:-$(openssl rand -hex 32)}
export MSF_WS_JSON_RPC_API_TOKEN=${MSF_WS_JSON_RPC_API_TOKEN:-$(openssl rand -hex 32)}

echo "Starting MSF Web Services locally..."
echo "REST API will be on: http://localhost:8080"
echo "JSON-RPC API will be on: http://localhost:8081"
echo ""
echo "API Token: $MSF_WS_JSON_RPC_API_TOKEN"
echo "Use this token in the web UI login page"
echo ""

# Navigate to MSF directory (adjust path if needed)
cd "$(dirname "$0")/.." || exit 1

# Start REST API
thin --rackup msf-ws.ru --address 0.0.0.0 --port 8080 --environment production --tag msf-ws start &
REST_PID=$!

# Start JSON-RPC
thin --rackup msf-json-rpc.ru --address 0.0.0.0 --port 8081 --environment production --tag msf-json-rpc start &
RPC_PID=$!

echo "Services started. PIDs: REST=$REST_PID, RPC=$RPC_PID"
echo "Press Ctrl+C to stop"

# Wait for interrupt
trap "kill $REST_PID $RPC_PID; exit" INT TERM
wait
