# Etapa de build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de produção
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/storage ./storage

RUN npm install --production

ENV PORT=3333
EXPOSE 3333

CMD ["node", "dist/main"]
