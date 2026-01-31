#!/bin/bash

# When repo is volume-mounted, config/database.yml may be missing or empty (gitignored).
mkdir -p config
if [ ! -s config/database.yml ]; then
  if [ -s docker/database.yml ]; then
    echo "No or empty config/database.yml, copying docker/database.yml..."
    cp -f docker/database.yml config/database.yml
  else
    echo "Creating config/database.yml from template (uses DATABASE_URL)..."
    cat > config/database.yml << 'DBYAML'
development: &pgsql
  url: <%= ENV['DATABASE_URL'] %>

production: &production
  <<: *pgsql
DBYAML
  fi
fi

# Wait for database to be ready
# Use Ruby/PG to check connectivity since pg_isready may not be available
until ruby -e "require 'pg'; PG.connect(host: 'db', port: 5432, user: 'postgres', dbname: 'msf').close" 2>/dev/null; do
  echo "Waiting for database..."
  sleep 2
done

echo "Database is ready. Starting web services..."

# Start REST API server in background (MSF_DATABASE_CONFIG so REST finds config when CWD varies)
echo "Starting REST API on port 8080..."
MSF_DATABASE_CONFIG="$(pwd)/config/database.yml" thin --rackup msf-ws.ru --address 0.0.0.0 --port 8080 --environment production --tag msf-ws start > /tmp/msf-ws.log 2>&1 &
REST_PID=$!

# Start JSON-RPC server in background
echo "Starting JSON-RPC API on port 8081..."
thin --rackup msf-json-rpc.ru --address 0.0.0.0 --port 8081 --environment production --tag msf-json-rpc start > /tmp/msf-rpc.log 2>&1 &
RPC_PID=$!

# Wait for services to start
echo "Waiting for web services to initialize..."
sleep 8

# Check if services are running
if ! kill -0 $REST_PID 2>/dev/null; then
  echo "ERROR: REST API failed to start. Check /tmp/msf-ws.log"
fi

if ! kill -0 $RPC_PID 2>/dev/null; then
  echo "ERROR: JSON-RPC API failed to start. Check /tmp/msf-rpc.log"
fi

echo "Web services started. REST API PID: $REST_PID, JSON-RPC PID: $RPC_PID"

# Start msfconsole in background (don't let it kill the container if it fails)
./msfconsole -r docker/msfconsole.rc -y config/database.yml &
MSFCONSOLE_PID=$!

# Keep container alive and monitor services
echo "All services started. Container will stay alive to keep web services running."
echo "REST API PID: $REST_PID, JSON-RPC PID: $RPC_PID, MSFConsole PID: $MSFCONSOLE_PID"

# Function to cleanup on exit
cleanup() {
    echo "Shutting down services..."
    kill $REST_PID $RPC_PID $MSFCONSOLE_PID 2>/dev/null
    exit 0
}
trap cleanup SIGTERM SIGINT

# Monitor services and keep container alive
while true; do
    # Check if web services are still running
    if ! kill -0 $REST_PID 2>/dev/null; then
        echo "WARNING: REST API (PID $REST_PID) is not running"
    fi
    if ! kill -0 $RPC_PID 2>/dev/null; then
        echo "WARNING: JSON-RPC API (PID $RPC_PID) is not running"
    fi
    sleep 30
done
