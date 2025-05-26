FROM node:20.3.1

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml .
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --ignore-scripts --frozen-lockfile

ARG NODE_ENV=production
ARG SENTRY_AUTH_TOKEN
ARG SOURCE_VERSION

RUN pnpm b prepare
RUN pnpm b build
RUN pnpm b sentry
RUN pnpm w build


FROM node:20.3.1-alpine

COPY --from=0 /app/package.json /app/package.json
COPY --from=0 /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=0 /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml

COPY --from=0 /app/webapp/package.json /app/webapp/package.json
COPY --from=0 /app/backend/package.json /app/backend/package.json
COPY --from=0 /app/shared/package.json /app/shared/package.json

COPY --from=0 /app/webapp/dist /app/webapp/dist
COPY --from=0 /app/backend/dist /app/backend/dist
COPY --from=0 /app/backend/src/prisma /app/backend/src/prisma

WORKDIR /app

RUN npm install -g pnpm
RUN pnpm install --ignore-scripts --frozen-lockfile --prod

RUN pnpm b pgc

ARG SOURCE_VERSION
ENV SOURCE_VERSION=$SOURCE_VERSION

CMD pnpm b pmp && pnpm b start