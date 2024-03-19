FROM golang:1.21.5 AS build-stage
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go ./
COPY migrations/ ./migrations
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o ./LocalFileSharing

FROM node:alpine AS js-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY astro.config.mjs tailwind.config.cjs tsconfig.json ./
COPY public/ ./public
COPY src/ ./src
COPY info.json ./info.json
RUN pnpm run build

COPY --from=build-stage /app/LocalFileSharing ./LocalFileSharing

ENTRYPOINT ["/app/LocalFileSharing", "serve"]