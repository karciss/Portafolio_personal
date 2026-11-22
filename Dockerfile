FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY index.html vite.config.js ./
COPY src ./src
RUN npm run build

FROM node:24-alpine
ENV NODE_ENV=production PORT=3000 DB_PATH=/app/data/portfolio.sqlite
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && mkdir -p /app/data && chown -R node:node /app
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node server ./server
COPY --chown=node:node src/portfolio.js ./src/portfolio.js
USER node
EXPOSE 3000
CMD ["node", "server/index.js"]
