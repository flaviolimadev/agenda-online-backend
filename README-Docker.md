# 🐳 Backend Agenda - Docker

Este documento contém instruções para executar o backend da aplicação Agenda usando Docker.

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🚀 Execução Rápida

### 1. Usando Docker Compose (Recomendado)

```bash
# Build e executar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f agenda-backend

# Parar todos os serviços
docker-compose down
```

### 2. Usando Docker diretamente

```bash
# Build da imagem
docker build -t agenda-backend .

# Executar container
docker run -d \
  --name agenda-backend \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e DB_HOST=localhost \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=123456 \
  -e DB_DATABASE=agenda_db \
  agenda-backend
```

## 🔧 Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NODE_ENV` | Ambiente de execução | `production` |
| `PORT` | Porta da aplicação | `3001` |
| `DB_HOST` | Host do banco de dados | `agenda-db` |
| `DB_PORT` | Porta do banco de dados | `5432` |
| `DB_USERNAME` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `123456` |
| `DB_DATABASE` | Nome do banco | `agenda_db` |
| `JWT_SECRET` | Chave secreta do JWT | Configurada |
| `JWT_EXPIRES_IN` | Expiração do JWT | `7d` |

### Portas

- **Backend API**: `3001`
- **PostgreSQL**: `5432`

## 🏗️ Estrutura do Dockerfile

### Multi-stage Build

1. **Stage 1 (Builder)**:
   - Instala dependências de desenvolvimento
   - Compila o código TypeScript
   - Gera o build de produção

2. **Stage 2 (Production)**:
   - Usa apenas dependências de produção
   - Executa como usuário não-root (segurança)
   - Inclui health check

## 🔍 Health Check

O container inclui um health check que verifica:

- Endpoint `/health` respondendo com status 200
- Timeout de 2 segundos
- Intervalo de 30 segundos

### Testar Health Check

```bash
# Verificar status do health check
docker inspect agenda-backend | grep Health -A 10

# Testar endpoint manualmente
curl http://localhost:3001/health
```

## 📊 Monitoramento

### Logs

```bash
# Ver logs em tempo real
docker-compose logs -f agenda-backend

# Ver logs das últimas 100 linhas
docker-compose logs --tail=100 agenda-backend
```

### Status dos Containers

```bash
# Verificar status
docker-compose ps

# Ver estatísticas de uso
docker stats
```

## 🛠️ Desenvolvimento

### Build para Desenvolvimento

```bash
# Build sem cache
docker-compose build --no-cache

# Build com argumentos específicos
docker build --build-arg NODE_ENV=development -t agenda-backend:dev .
```

### Debug

```bash
# Executar em modo interativo
docker run -it --rm agenda-backend sh

# Verificar arquivos dentro do container
docker exec -it agenda-backend ls -la
```

## 🔒 Segurança

- Execução como usuário não-root (`nestjs`)
- Uso de `dumb-init` para gerenciamento de processos
- Health checks para monitoramento
- Configuração de CORS adequada

## 🚨 Troubleshooting

### Problemas Comuns

1. **Container não inicia**:
   ```bash
   docker-compose logs agenda-backend
   ```

2. **Erro de conexão com banco**:
   ```bash
   # Verificar se o PostgreSQL está rodando
   docker-compose ps agenda-db
   
   # Verificar logs do banco
   docker-compose logs agenda-db
   ```

3. **Porta já em uso**:
   ```bash
   # Verificar portas em uso
   netstat -tulpn | grep 3001
   
   # Parar containers conflitantes
   docker-compose down
   ```

### Limpeza

```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Limpeza completa
docker system prune -a
```

## 📝 Deploy

### Coolify

O arquivo `coolify.yaml` está configurado para deploy automático no Coolify.

### Produção

Para produção, considere:

- Usar secrets management
- Configurar volumes para logs
- Implementar backup do banco
- Configurar reverse proxy (nginx)
- Usar certificados SSL

## 🔗 Links Úteis

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [NestJS Docker](https://docs.nestjs.com/deployment)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres) 