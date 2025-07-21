ARG BUILD_FROM
FROM ${BUILD_FROM}

# ---------- install NodeJS ----------
RUN apk add --no-cache nodejs npm python3 make g++

# ---------- copy source -------------
WORKDIR /usr/src/app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

# ---------- copy s6 service files ---
COPY rootfs /
