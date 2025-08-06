# 🚀 Deploy no Coolify - Backend Agenda

Este documento contém instruções específicas para deploy do backend no Coolify.

## 📋 Pré-requisitos

- Conta no Coolify
- Repositório Git configurado
- Docker habilitado no Coolify

## 🔧 Configuração do Repositório

### Estrutura Necessária

```
backendagenda/
├── Dockerfile
├── docker-compose.yml
├── coolify.yaml
├── healthcheck.js
├── .dockerignore
├── package.json
├── tsconfig.json
├── nest-cli.json
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── app.controller.ts
    ├── app.service.ts
    ├── scripts/
    │   ├── migrate-passwords.ts
    │   └── test-password-hash.ts
    └── ...
```

### Arquivos Obrigatórios

1. **Dockerfile** - Configuração do container
2. **healthcheck.js** - Script de verificação de saúde
3. **package.json** - Dependências e scripts
4. **tsconfig.json** - Configuração TypeScript
5. **nest-cli.json** - Configuração NestJS

## 🚀 Deploy no Coolify

### 1. Configuração Inicial

1. Acesse o painel do Coolify
2. Clique em "New Application"
3. Selecione "Docker Compose"
4. Conecte seu repositório Git

### 2. Configuração do Build

```yaml
# coolify.yaml
version: '3.8'

services:
  agenda-backend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - BUILD_DATE=${BUILD_DATE}
        - VCS_REF=${VCS_REF}
        - VERSION=${VERSION:-latest}
    container_name: agenda-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DB_HOST=${DB_HOST:-agenda-db}
      - DB_PORT=${DB_PORT:-5432}
      - DB_USERNAME=${DB_USERNAME:-postgres}
      - DB_PASSWORD=${DB_PASSWORD:-123456}
      - DB_DATABASE=${DB_DATABASE:-agenda_db}
      - JWT_SECRET=${JWT_SECRET:-da0f624b767fc436623e9a8485e42fbe1e303478333f7a0ac9ced9db6c4ec46d69bc676c2e2fee055591456b624b85f3f485f66573e31d161ebb5328f5906b3f}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-7d}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    labels:
      - "coolify.managed=true"
      - "coolify.type=application"
      - "coolify.framework=nestjs"
      - "coolify.language=typescript"
    networks:
      - coolify-network

networks:
  coolify-network:
    external: true
```

### 3. Variáveis de Ambiente

Configure as seguintes variáveis no Coolify:

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `NODE_ENV` | Ambiente | `production` |
| `NODE_OPTIONS` | Opções do Node.js | `--max-old-space-size=4096` |
| `PORT` | Porta da aplicação | `3001` |
| `DB_HOST` | Host do banco | `agenda-db` |
| `DB_PORT` | Porta do banco | `5432` |
| `DB_USERNAME` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `123456` |
| `DB_DATABASE` | Nome do banco | `agenda_db` |
| `JWT_SECRET` | Chave JWT | Configurada |
| `JWT_EXPIRES_IN` | Expiração JWT | `7d` |

## 🚨 Troubleshooting

### Erro: "failed to calculate checksum of ref"

**Problema**: Docker não consegue encontrar arquivos necessários.

**Solução**:
1. Verifique se todos os arquivos estão no repositório
2. Confirme que o `.dockerignore` não está excluindo arquivos necessários
3. Verifique se a pasta `src/` existe e contém os arquivos

### Erro: "COPY test/ ./test/: not found"

**Problema**: Dockerfile tentando copiar pasta que não existe.

**Solução**: ✅ **Corrigido** - Removida a cópia da pasta `test/` do Dockerfile.

### Erro: "npm ci --only=production=false"

**Problema**: Falha na instalação de dependências.

**Solução**:
1. Verifique se o `package.json` está correto
2. Confirme que o `package-lock.json` está no repositório
3. Verifique se há problemas de rede

### Erro: "Build failed"

**Problema**: Falha no build do TypeScript.

**Solução**:
1. Verifique se todos os arquivos TypeScript estão corretos
2. Confirme que o `tsconfig.json` está configurado
3. Verifique se há erros de sintaxe

### Erro: "ReferenceError: crypto is not defined"

**Problema**: Módulo crypto não está disponível no Node.js.

**Solução**: ✅ **Corrigido** - Adicionado polyfill para crypto e atualizado para Node.js 20.

### Erro: "Health check failed"

**Problema**: Container não está respondendo ao health check.

**Solução**:
1. Verifique se o endpoint `/health` está funcionando
2. Confirme se a aplicação está iniciando corretamente
3. Verifique os logs do container

## 🔍 Verificação do Deploy

### 1. Verificar Build

```bash
# No painel do Coolify, verifique:
- Build logs
- Status do container
- Health check status
```

### 2. Testar Endpoints

```bash
# Health check
curl https://seu-dominio.com/health

# API base
curl https://seu-dominio.com/

# Login
curl -X POST https://seu-dominio.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"Senha123"}'
```

### 3. Verificar Logs

No painel do Coolify:
1. Acesse a aplicação
2. Clique em "Logs"
3. Verifique se há erros

## 📊 Monitoramento

### Health Check

O health check verifica:
- Endpoint `/health` respondendo com 200
- Timeout de 2 segundos
- Intervalo de 30 segundos

### Logs Importantes

- **Startup**: Verificar se a aplicação inicia corretamente
- **Database**: Verificar conexão com PostgreSQL
- **JWT**: Verificar se o JWT está configurado
- **CORS**: Verificar se o CORS está funcionando

## 🔧 Configurações Avançadas

### Customização do Build

```dockerfile
# Adicionar argumentos de build
ARG NODE_ENV=production
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Usar argumentos
ENV NODE_ENV=${NODE_ENV}
LABEL org.label-schema.build-date=${BUILD_DATE}
LABEL org.label-schema.vcs-ref=${VCS_REF}
LABEL org.label-schema.version=${VERSION}
```

### Otimização de Performance

```dockerfile
# Multi-stage build otimizado
# Stage 1: Dependências
# Stage 2: Build
# Stage 3: Produção
```

## 📝 Checklist de Deploy

- [ ] Repositório configurado no Coolify
- [ ] Dockerfile presente e correto
- [ ] healthcheck.js presente
- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Health check passando
- [ ] Endpoints respondendo
- [ ] Logs sem erros críticos

## 🔗 Links Úteis

- [Coolify Documentation](https://coolify.io/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [NestJS Deployment](https://docs.nestjs.com/deployment) 