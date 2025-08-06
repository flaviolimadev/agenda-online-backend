import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { HashService } from '../common/services/hash.service';

async function testPasswordHash() {
  console.log('🧪 Testando criptografia de senhas...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const hashService = app.get(HashService);

  try {
    const testPassword = 'MinhaSenha123';
    
    console.log(`📝 Senha original: ${testPassword}`);
    
    // Gerar hash
    const hashedPassword = await hashService.hashPassword(testPassword);
    console.log(`🔐 Hash gerado: ${hashedPassword}`);
    
    // Verificar se é um hash válido
    const isValidHash = hashService.isHash(hashedPassword);
    console.log(`✅ É um hash válido: ${isValidHash}`);
    
    // Testar comparação com senha correta
    const isCorrectPassword = await hashService.comparePassword(testPassword, hashedPassword);
    console.log(`✅ Senha correta: ${isCorrectPassword}`);
    
    // Testar comparação com senha incorreta
    const isWrongPassword = await hashService.comparePassword('SenhaErrada123', hashedPassword);
    console.log(`❌ Senha incorreta: ${isWrongPassword}`);
    
    // Testar que hashes diferentes são gerados para a mesma senha
    const hash1 = await hashService.hashPassword(testPassword);
    const hash2 = await hashService.hashPassword(testPassword);
    console.log(`🔄 Hash 1: ${hash1}`);
    console.log(`🔄 Hash 2: ${hash2}`);
    console.log(`🔄 Hashes são diferentes: ${hash1 !== hash2}`);
    
    console.log('\n🎉 Todos os testes passaram!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    await app.close();
  }
}

// Executar o script se for chamado diretamente
if (require.main === module) {
  testPasswordHash()
    .then(() => {
      console.log('✅ Testes concluídos com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
} 