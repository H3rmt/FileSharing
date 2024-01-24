FROM golang:1.21.5 AS build-stage
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go ./
COPY migrations/ ./migrations
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o ./LocalFileSharing

FROM node:alpine AS js-base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY astro.config.mjs tailwind.config.cjs tsconfig.json ./
COPY public/ ./public
COPY src/ ./src
COPY info.json ./info.json
RUN npm run build

COPY --from=build-stage /app/LocalFileSharing ./LocalFileSharing

ENTRYPOINT ["/app/LocalFileSharing", "serve"]