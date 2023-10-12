FROM golang:1.19 AS build-stage
WORKDIR /app
COPY pocketbase/go.mod pocketbase/go.sum ./
RUN go mod download
COPY pocketbase/*.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o ./LocalFileSharing

FROM node:20-slim AS js-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY astro.config.mjs tailwind.config.cjs tsconfig.json ./
COPY public/ ./public
COPY src/ ./src
RUN pnpm build

FROM alpine:latest AS release
WORKDIR /
COPY --from=build-stage /app/LocalFileSharing ./LocalFileSharing
COPY --from=js-base /app/dist ./dist
EXPOSE 8080

ENTRYPOINT ["/LocalFileSharing", "serve"]