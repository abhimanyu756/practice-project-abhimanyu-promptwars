# Stage 1: Build the React client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
RUN npm run build

# Stage 2: Build the Express server
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --legacy-peer-deps
COPY server/ ./
RUN npx tsc -p tsconfig.json

# Stage 3: Production image
FROM node:20-alpine
WORKDIR /app

# Copy compiled server
COPY --from=server-build /app/server/dist/src ./dist
COPY server/package*.json ./
RUN npm install --production --legacy-peer-deps

# Copy built client into public/ directory (served by Express)
COPY --from=client-build /app/client/dist ./public

# Cloud Run uses port 8080
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/server.js"]
