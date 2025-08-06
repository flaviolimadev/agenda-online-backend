import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { HashService } from '../common/services/hash.service';

async function migratePasswords() {
  console.log('🚀 Iniciando migração de senhas...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const hashService = app.get(HashService);

  try {
    // Buscar todos os usuários
    const users = await usersService.findAll();
    console.log(`📊 Encontrados ${users.length} usuários para verificar`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Buscar usuário completo com senha
      const fullUser = await usersService.findByEmail(user.email, true);
      
      // Verificar se a senha já está criptografada
      if (hashService.isHash(fullUser.password)) {
        console.log(`✅ Usuário ${user.email} já tem senha criptografada`);
        skippedCount++;
        continue;
      }

      // Criptografar a senha
      const hashedPassword = await hashService.hashPassword(fullUser.password);
      
      // Atualizar o usuário com a senha criptografada
      await usersService.update(user.id, { password: hashedPassword });
      
      console.log(`🔐 Senha criptografada para usuário ${user.email}`);
      migratedCount++;
    }

    console.log('\n📈 Resumo da migração:');
    console.log(`   ✅ Migrados: ${migratedCount}`);
    console.log(`   ⏭️  Pulados: ${skippedCount}`);
    console.log(`   📊 Total: ${users.length}`);

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await app.close();
  }
}

// Executar o script se for chamado diretamente
if (require.main === module) {
  migratePasswords()
    .then(() => {
      console.log('🎉 Migração concluída com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
} 