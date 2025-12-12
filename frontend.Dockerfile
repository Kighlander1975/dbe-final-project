FROM node:20-alpine

WORKDIR /app

# Package files kopieren
COPY frontend/package*.json ./

# Dependencies installieren
RUN npm install

# Entrypoint kopieren
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
