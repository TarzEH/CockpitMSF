#!/bin/bash

# Generate secure random tokens for MSF Web Services

echo "Generating secure tokens for MSF Web Services..."
echo ""
echo "Add these to your .env file:"
echo ""
echo "MSF_WS_SESSION_SECRET=$(openssl rand -hex 32)"
echo "MSF_WS_JSON_RPC_API_TOKEN=$(openssl rand -hex 32)"
echo ""
