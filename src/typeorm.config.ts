// src/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'seu_usuario',
  password: process.env.DB_PASSWORD || 'sua_senha',
  database: process.env.DB_DATABASE || 'seu_banco',
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  synchronize: process.env.NODE_ENV !== 'production', // use false em produção
  logging: true, // Adiciona logs para debug
  ssl: { rejectUnauthorized: false }, // Força SSL para banco remoto
};
