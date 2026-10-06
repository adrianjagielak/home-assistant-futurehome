ARG BUILD_FROM
FROM ${BUILD_FROM}

# ---------- install NodeJS ----------
RUN apk add --no-cache nodejs npm python3 make g++

# ---------- copy source & build -----
WORKDIR /usr/src/app
COPY package.json package-lock.json tsconfig.json ./

# ① install EVERYTHING (prod + dev)
RUN npm ci

COPY src ./src

# ② compile TypeScript
RUN npm run build

# ③ throw dev stuff away so the final image stays small
RUN npm prune --omit=dev

# ---------- copy s6 service files ---
COPY rootfs /
