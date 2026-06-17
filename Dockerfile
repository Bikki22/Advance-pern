# Stage 1: Frontend
FROM node:22-bookworm-slim AS frontend-build
RUN corepack enable

WORKDIR /app/frontend
COPY frontend/ ./

ENV VITE_API_URL=

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN pnpm install --frozen-lockfile \
    && pnpm build


# Stage 2: Backend
FROM node:22-bookworm-slim AS backend-build
RUN corepack enable

WORKDIR /app
COPY backend/ ./

RUN pnpm install --frozen-lockfile \
    && pnpm build


# Stage 3: Runtime
FROM node:22-bookworm-slim AS runner
RUN corepack enable

WORKDIR /app
ENV NODE_ENV=production

COPY backend/package.json backend/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile \
    && pnpm store prune

COPY --from=backend-build /app/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001

USER node

CMD ["node", "dist/index.js"]