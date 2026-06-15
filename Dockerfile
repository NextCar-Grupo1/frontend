# =============================================================================
# Dockerfile for NextCar Frontend (Angular 21)
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --output-path=dist

# ── Runtime stage: Nginx ──────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]