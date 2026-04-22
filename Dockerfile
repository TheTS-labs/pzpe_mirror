FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./

RUN npm ci


FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS prod-deps
COPY package.json package-lock.json ./

RUN npm ci --omit=dev

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 reactrouter
USER reactrouter

COPY --from=prod-deps --chown=reactrouter:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=reactrouter:nodejs /app/build ./build
COPY --from=builder --chown=reactrouter:nodejs /app/package.json ./

EXPOSE 3000

CMD ["npm", "run", "start"]