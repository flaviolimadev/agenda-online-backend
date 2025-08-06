import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendasService } from './agendas.service';
import { AgendasController } from './agendas.controller';
import { Agenda } from './entities/agenda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agenda])],
  controllers: [AgendasController],
  providers: [AgendasService],
  exports: [AgendasService], // Exporta o service para uso em outros módulos
})
export class AgendasModule {} 