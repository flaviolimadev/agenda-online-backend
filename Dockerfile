# Dockerfile para Backend Agenda - NestJS/TypeScript
# Multi-stage build para otimizar o tamanho da imagem final

# Stage 1: Build da aplicação
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependências
RUN npm ci --only=production=false

# Copiar código fonte
COPY src/ ./src/

# Criar pasta test se não existir (para evitar erros)
RUN mkdir -p test

# Build da aplicação
RUN npm run build

# Stage 2: Produção
FROM node:18-alpine AS production

# Instalar dependências de produção
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar arquivos buildados do stage anterior
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copiar arquivo de health check
COPY healthcheck.js ./

# Mudar para usuário não-root
USER nestjs

# Expor porta 3001
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando para iniciar a aplicação
CMD ["dumb-init", "node", "dist/main.js"] 