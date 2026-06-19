FROM node:24-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN corepack enable

WORKDIR /app

COPY . .

EXPOSE 3000

RUN pnpm rebuild
RUN pnpm run build

CMD ["node", ".output/server/index.mjs"]