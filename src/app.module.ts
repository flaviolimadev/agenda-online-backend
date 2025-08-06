import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PlanosModule } from './planos/planos.module';
import { AgendasModule } from './agendas/agendas.module';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || databaseConfig.host,
        port: configService.get('DB_PORT') || databaseConfig.port,
        username: configService.get('DB_USERNAME') || databaseConfig.username,
        password: configService.get('DB_PASSWORD') || databaseConfig.password,
        database: configService.get('DB_DATABASE') || databaseConfig.database,
        entities: [__dirname + '/**/*.entity.{js,ts}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PlanosModule,
    AgendasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
