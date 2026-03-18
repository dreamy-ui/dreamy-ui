# =============================================================================
# Stage 1: Base image with Node 22 + pnpm 9.1.4
# =============================================================================
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.1.4 --activate

# =============================================================================
# Stage 2: Install all workspace dependencies
# Copies only package manifests first for better layer caching — a source code
# change will not invalidate the dependency install layer.
# =============================================================================
FROM base AS deps
WORKDIR /repo

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/panda-preset/package.json ./packages/panda-preset/package.json
COPY packages/react/package.json        ./packages/react/package.json
COPY packages/cli/package.json          ./packages/cli/package.json
COPY packages/mcp/package.json          ./packages/mcp/package.json
COPY website/package.json               ./website/package.json

RUN pnpm install --frozen-lockfile

# =============================================================================
# Stage 3: Build workspace packages and the website
# =============================================================================
FROM base AS builder
WORKDIR /repo

# Pull in installed node_modules from the deps stage
COPY --from=deps /repo ./

# Overlay the full source (local node_modules excluded via .dockerignore)
COPY . .

# VITE_SOURCE_REPO must be baked into the client bundle at Vite build time.
# Pass it as a build argument: --build-arg VITE_SOURCE_REPO=owner/repo
ARG VITE_SOURCE_REPO
ENV VITE_SOURCE_REPO=$VITE_SOURCE_REPO

# Build in dependency order:
#   1. @dreamy-ui/panda-preset  (website peer dep)
#   2. @dreamy-ui/react         (website peer dep)
#   3. dreamy-ui-website        (the app itself)
RUN pnpm --filter @dreamy-ui/panda-preset build && \
    pnpm --filter @dreamy-ui/react build && \
    pnpm --filter dreamy-ui-website build

# =============================================================================
# Stage 4: Create a pruned, standalone production deployment
# pnpm deploy resolves workspace deps and copies only production node_modules.
# =============================================================================
FROM base AS deployer
WORKDIR /repo

COPY --from=builder /repo ./
RUN pnpm --filter dreamy-ui-website deploy --prod /standalone

# =============================================================================
# Stage 5: Minimal production runner
# =============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# Production node_modules (workspace deps resolved and inlined)
COPY --from=deployer /standalone ./

# Built React Router app (not included in pnpm deploy output)
COPY --from=builder /repo/website/build ./build

EXPOSE 3000

ENV NODE_ENV=production

# NODE_ENV is already set above; env vars (GITHUB_TOKEN, VITE_SOURCE_REPO, etc.)
# must be injected at runtime via docker run -e / docker compose environment.
CMD ["node", "./build/server/index2.js"]
