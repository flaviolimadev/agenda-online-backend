import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plano } from './entities/plano.entity';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@Injectable()
export class PlanosService {
  constructor(
    @InjectRepository(Plano)
    private planosRepository: Repository<Plano>,
  ) {}

  // CREATE - Criar plano
  async create(createPlanoDto: CreatePlanoDto): Promise<Plano> {
    const plano = this.planosRepository.create({
      ...createPlanoDto,
      ativo: createPlanoDto.ativo !== undefined ? createPlanoDto.ativo : true,
    });

    return this.planosRepository.save(plano);
  }

  // READ - Buscar todos os planos
  async findAll(): Promise<Plano[]> {
    return this.planosRepository.find({
      order: { value: 'ASC' },
    });
  }

  // READ - Buscar planos ativos
  async findAtivos(): Promise<Plano[]> {
    return this.planosRepository.find({
      where: { ativo: true },
      order: { value: 'ASC' },
    });
  }

  // READ - Buscar plano por ID
  async findOne(id: number): Promise<Plano> {
    const plano = await this.planosRepository.findOne({
      where: { id },
    });

    if (!plano) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }

    return plano;
  }

  // UPDATE - Atualizar plano
  async update(id: number, updatePlanoDto: UpdatePlanoDto): Promise<Plano> {
    const plano = await this.findOne(id);
    Object.assign(plano, updatePlanoDto);
    return this.planosRepository.save(plano);
  }

  // DELETE - Remover plano
  async remove(id: number): Promise<void> {
    const plano = await this.findOne(id);
    await this.planosRepository.remove(plano);
  }

  // Buscar planos por valor máximo
  async findByMaxValue(maxValue: number): Promise<Plano[]> {
    return this.planosRepository.find({
      where: { value: maxValue },
      order: { value: 'ASC' },
    });
  }

  // Buscar planos por tempo
  async findByTempo(tempo: number): Promise<Plano[]> {
    return this.planosRepository.find({
      where: { tempo },
      order: { value: 'ASC' },
    });
  }

  // Ativar/Desativar plano
  async toggleAtivo(id: number): Promise<Plano> {
    const plano = await this.findOne(id);
    plano.ativo = !plano.ativo;
    return this.planosRepository.save(plano);
  }
} 