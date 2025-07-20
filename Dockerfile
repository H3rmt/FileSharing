FROM --platform=$BUILDPLATFORM golang:alpine@sha256:daae04ebad0c21149979cd8e9db38f565ecefd8547cf4a591240dc1972cf1399 AS build
ARG TARGETOS
ARG TARGETARCH

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go ./
COPY migrations/ ./migrations
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -ldflags="-s -w" -o ./FileSharing

FROM --platform=$BUILDPLATFORM node:alpine@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a AS js-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY public/ ./public
COPY src/ ./src
COPY astro.config.mjs tailwind.config.cjs tsconfig.json icon.png info.json ./
RUN pnpm run build

FROM node:alpine@sha256:820e86612c21d0636580206d802a726f2595366e1b867e564cbc652024151e8a AS run
WORKDIR /app
COPY --from=js-base /app/dist /app/dist
COPY --from=js-base /app/node_modules /app/node_modules
COPY --from=build /app/FileSharing /app/FileSharing
ENTRYPOINT ["./FileSharing", "serve"]