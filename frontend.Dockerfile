FROM node:20-alpine

WORKDIR /app

# Entrypoint kopieren (aus dem Root-Verzeichnis)
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
