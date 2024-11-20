FROM golang:1.21.5 AS build-stage
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go ./
COPY migrations/ ./migrations
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o ./FileSharing

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
RUN rm -r node_modules
RUN pnpm install --prod

FROM node:alpine AS run
COPY --from=js-base /app/dist /dist
COPY --from=js-base /app/node_modules /node_modules
COPY --from=build-stage /app/FileSharing /FileSharing
ENTRYPOINT ["/FileSharing", "serve"]