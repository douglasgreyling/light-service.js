# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

ARG UID=1000
ARG GID=1000

FROM node:${NODE_VERSION}-alpine AS base

ARG UID
ARG GID

RUN apk add --no-cache bash git

RUN if [ "${UID}" != "1000" ] || [ "${GID}" != "1000" ]; then \
      deluser node; \
      addgroup -g "${GID}" node; \
      adduser -u "${UID}" -G node -s /bin/bash -D node; \
    fi

ENV NPM_CONFIG_CACHE=/home/node/.npm \
    PATH=/app/node_modules/.bin:$PATH

RUN mkdir -p /app "${NPM_CONFIG_CACHE}" && chown -R node:node /app /home/node

COPY --chmod=0755 docker/entrypoint.sh /usr/local/bin/dev-entrypoint

WORKDIR /app
USER node

FROM base AS deps

ARG UID
ARG GID

COPY --chown=node:node package.json package-lock.json ./

RUN --mount=type=cache,target=/home/node/.npm,uid=${UID},gid=${GID} \
    npm ci && \
    sha256sum package-lock.json | cut -d' ' -f1 > node_modules/.install-checksum

FROM base AS dev

ENV NODE_ENV=development

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

ENTRYPOINT ["dev-entrypoint"]
CMD ["bash"]

FROM base AS ci

ENV NODE_ENV=test \
    CI=true

COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
