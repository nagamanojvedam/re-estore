# ---------------------------
# STAGE 1: Build Frontend
# ---------------------------
FROM node:22-alpine AS frontend-builder
RUN corepack enable

WORKDIR /app/frontend

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm config set node-linker hoisted
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY frontend .
RUN pnpm run build


# ---------------------------
# STAGE 2: Build Backend
# ---------------------------
FROM node:22-alpine AS backend-builder
RUN corepack enable

WORKDIR /app/backend

# Copy backend package files and install deps
COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm config set node-linker hoisted
RUN pnpm install --prod --frozen-lockfile

# Copy backend source code
COPY backend .


# ---------------------------
# FINAL STAGE: Runner
# ---------------------------
FROM node:22-alpine AS runner
RUN corepack enable

WORKDIR /app

# Copy backend (including node_modules)
COPY --from=backend-builder /app/backend ./backend

# Copy only frontend build output
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose backend port
EXPOSE 3000


# Start backend server
WORKDIR /app/backend
CMD ["pnpm", "start"]
