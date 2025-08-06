import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanosService } from './planos.service';
import { PlanosController } from './planos.controller';
import { Plano } from './entities/plano.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plano])],
  controllers: [PlanosController],
  providers: [PlanosService],
  exports: [PlanosService], // Exporta o service para uso em outros módulos
})
export class PlanosModule {} 