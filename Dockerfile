# =============================================================================
# Stage 1: Base image with Bun on Alpine
# =============================================================================
FROM oven/bun:alpine AS base
WORKDIR /repo

# =============================================================================
# Stage 2: Install all workspace dependencies
# Copies only package manifests first for better layer caching.
# =============================================================================
FROM base AS deps

COPY package.json bun.lock pnpm-workspace.yaml ./
COPY packages/panda-preset/package.json ./packages/panda-preset/package.json
COPY packages/react/package.json        ./packages/react/package.json
COPY packages/cli/package.json          ./packages/cli/package.json
COPY packages/mcp/package.json          ./packages/mcp/package.json
COPY components/package.json            ./components/package.json
COPY website/package.json               ./website/package.json

RUN bun install --frozen-lockfile

# =============================================================================
# Stage 3: Build workspace packages and the website
# =============================================================================
FROM base AS builder

COPY --from=deps /repo ./
COPY . .

ARG VITE_SOURCE_REPO
ENV VITE_SOURCE_REPO=$VITE_SOURCE_REPO
# Prisma migrate runs during `website` build; keep path aligned with runtime DATABASE_URL.
ENV DATABASE_URL=file:./prisma/data.db

RUN bun --filter @dreamy-ui/panda-preset build && \
    bun --filter @dreamy-ui/react build && \
    bun --filter dreamy-ui-website build

# =============================================================================
# Stage 4: Minimal production runner
# Keep the monorepo layout so workspace symlinks in website/node_modules stay valid.
# =============================================================================
FROM oven/bun:alpine AS runner
WORKDIR /repo

RUN apk add --no-cache wget

COPY --from=builder /repo/package.json /repo/bun.lock /repo/pnpm-workspace.yaml ./
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages ./packages
COPY --from=builder /repo/components ./components
COPY --from=builder /repo/website ./website

WORKDIR /repo/website

EXPOSE 3000

ENV NODE_ENV=production
ENV DATABASE_URL=file:./prisma/data.db

CMD ["bun", "./build/server/index.js"]
