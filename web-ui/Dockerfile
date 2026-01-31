# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration for SPA with API proxying
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Proxy JSON-RPC requests to local MSF JSON-RPC service (localhost:8081) \
    location /rpc { \
        rewrite ^/rpc$ /api/v1/json-rpc break; \
        rewrite ^/rpc/$ /api/v1/json-rpc break; \
        proxy_pass http://host.docker.internal:8081; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_read_timeout 300s; \
        proxy_connect_timeout 75s; \
        add_header Access-Control-Allow-Origin * always; \
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always; \
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always; \
        if ($request_method = OPTIONS) { \
            return 204; \
        } \
    } \
    \
    # Proxy REST API requests to local MSF REST API service (localhost:8080) \
    location /api/ { \
        proxy_pass http://host.docker.internal:8080/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_read_timeout 300s; \
        proxy_connect_timeout 75s; \
        add_header Access-Control-Allow-Origin * always; \
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always; \
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always; \
        if ($request_method = OPTIONS) { \
            return 204; \
        } \
    } \
    \
    # Serve static files and SPA routes \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
