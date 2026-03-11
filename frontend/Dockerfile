# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json* ./

RUN npm ci

# Copy application source
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL=http://localhost:8000

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
