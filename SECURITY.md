# 🔐 Segurança - Criptografia de Senhas

## Visão Geral

Este projeto implementa criptografia de senhas usando **bcrypt** para garantir a segurança dos dados dos usuários.

## 🛡️ Implementação

### HashService

O `HashService` é responsável por toda a criptografia de senhas:

```typescript
// Gerar hash de senha
const hashedPassword = await hashService.hashPassword(password);

// Comparar senha com hash
const isValid = await hashService.comparePassword(password, hashedPassword);

// Verificar se é um hash válido
const isHash = hashService.isHash(hashedPassword);
```

### Configuração

- **Salt Rounds**: 12 (recomendado para produção)
- **Algoritmo**: bcrypt
- **Formato**: `$2b$12$...`

## 📋 Funcionalidades

### ✅ Criptografia Automática

- **Registro**: Senhas são automaticamente criptografadas ao criar usuários
- **Atualização**: Senhas são re-criptografadas ao atualizar usuários
- **Login**: Comparação segura entre senha e hash

### ✅ Validação de Hash

- Verifica se uma string é um hash bcrypt válido
- Evita re-criptografia de senhas já criptografadas

### ✅ Migração de Dados

Script para migrar senhas existentes em texto plano para hash:

```bash
npm run migrate:passwords
```

## 🧪 Testes

Execute os testes de criptografia:

```bash
npm run test:hash
```

### Testes Incluídos

- ✅ Geração de hash
- ✅ Validação de hash
- ✅ Comparação de senhas corretas
- ✅ Comparação de senhas incorretas
- ✅ Unicidade de salt (hashes diferentes para mesma senha)

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run migrate:passwords` | Migra senhas existentes para hash |
| `npm run test:hash` | Executa testes de criptografia |

## 📊 Exemplo de Hash

```
Senha original: MinhaSenha123
Hash gerado: $2b$12$h2te7ILZLl.6IieV9YUjmOL26iLWDv3aN0848i.Jje6ut9Ur00vF6
```

## 🚀 Como Usar

### 1. Registro de Usuário

```typescript
// A senha será automaticamente criptografada
const user = await usersService.create({
  nome: 'João',
  email: 'joao@email.com',
  password: 'MinhaSenha123' // Será criptografada
});
```

### 2. Login

```typescript
// A comparação é feita automaticamente
const result = await authService.login('joao@email.com', 'MinhaSenha123');
```

### 3. Atualização de Senha

```typescript
// A nova senha será criptografada
await usersService.update(userId, {
  password: 'NovaSenha123' // Será criptografada
});
```

## 🔒 Boas Práticas

1. **Nunca armazene senhas em texto plano**
2. **Use salt rounds adequados** (12+ para produção)
3. **Não reutilize hashes** - cada senha deve ter seu próprio salt
4. **Valide hashes** antes de re-criptografar
5. **Use HTTPS** em produção

## 🚨 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Salt único para cada senha
- ✅ Salt rounds configuráveis
- ✅ Validação de hash
- ✅ Migração segura de dados existentes

## 📝 Logs

O sistema registra logs de segurança:

```
🔐 Senha criptografada para usuário joao@email.com
✅ Usuário joao@email.com já tem senha criptografada
```

## 🔄 Migração

Para migrar senhas existentes:

1. Execute o script de migração
2. Verifique os logs
3. Teste o login com usuários existentes

```bash
npm run migrate:passwords
```

## 🐛 Troubleshooting

### Erro: "Cannot read property 'hashPassword' of undefined"

- Verifique se o `HashService` está sendo injetado corretamente
- Confirme que o serviço está nos providers do módulo

### Erro: "Invalid salt"

- Verifique se o hash no banco está no formato correto
- Execute a migração novamente se necessário

### Senhas não estão sendo criptografadas

- Verifique se o `HashService` está sendo usado no `UsersService`
- Confirme que o método `create` está chamando `hashPassword` 