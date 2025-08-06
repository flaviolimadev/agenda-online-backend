import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Injectable()
export class AgendasService {
  constructor(
    @InjectRepository(Agenda)
    private agendasRepository: Repository<Agenda>,
  ) {}

  // CREATE - Criar agenda
  async create(createAgendaDto: CreateAgendaDto): Promise<Agenda> {
    // Validar se data_termino é posterior a data_inicio
    if (createAgendaDto.data_inicio && createAgendaDto.data_termino) {
      const inicio = new Date(createAgendaDto.data_inicio);
      const termino = new Date(createAgendaDto.data_termino);
      
      if (termino <= inicio) {
        throw new BadRequestException('Data de término deve ser posterior à data de início');
      }
    }

    const agenda = this.agendasRepository.create({
      ...createAgendaDto,
      status: createAgendaDto.status || 0,
    });

    return this.agendasRepository.save(agenda);
  }

  // READ - Buscar todas as agendas
  async findAll(): Promise<Agenda[]> {
    return this.agendasRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  // READ - Buscar agenda por ID
  async findOne(id: number): Promise<Agenda> {
    const agenda = await this.agendasRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!agenda) {
      throw new NotFoundException(`Agenda com ID ${id} não encontrada`);
    }

    return agenda;
  }

  // READ - Buscar agendas por usuário
  async findByUser(user_id: number): Promise<Agenda[]> {
    return this.agendasRepository.find({
      where: { user_id },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  // READ - Buscar agendas por status
  async findByStatus(status: number): Promise<Agenda[]> {
    return this.agendasRepository.find({
      where: { status },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  // READ - Buscar agendas por período
  async findByPeriod(data_inicio: string, data_termino: string): Promise<Agenda[]> {
    const inicio = new Date(data_inicio);
    const termino = new Date(data_termino);

    return this.agendasRepository.find({
      where: {
        data_inicio: inicio,
        data_termino: termino,
      },
      relations: ['user'],
      order: { data_inicio: 'ASC' },
    });
  }

  // UPDATE - Atualizar agenda
  async update(id: number, updateAgendaDto: UpdateAgendaDto): Promise<Agenda> {
    const agenda = await this.findOne(id);

    // Validar se data_termino é posterior a data_inicio
    if (updateAgendaDto.data_inicio && updateAgendaDto.data_termino) {
      const inicio = new Date(updateAgendaDto.data_inicio);
      const termino = new Date(updateAgendaDto.data_termino);
      
      if (termino <= inicio) {
        throw new BadRequestException('Data de término deve ser posterior à data de início');
      }
    }

    Object.assign(agenda, updateAgendaDto);
    return this.agendasRepository.save(agenda);
  }

  // DELETE - Remover agenda
  async remove(id: number): Promise<void> {
    const agenda = await this.findOne(id);
    await this.agendasRepository.remove(agenda);
  }

  // Buscar agendas ativas (status = 1)
  async findAtivas(): Promise<Agenda[]> {
    return this.agendasRepository.find({
      where: { status: 1 },
      relations: ['user'],
      order: { data_inicio: 'ASC' },
    });
  }

  // Buscar agendas pendentes (status = 0)
  async findPendentes(): Promise<Agenda[]> {
    return this.agendasRepository.find({
      where: { status: 0 },
      relations: ['user'],
      order: { data_inicio: 'ASC' },
    });
  }

  // Buscar agendas por data específica
  async findByDate(data: string): Promise<Agenda[]> {
    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);
    
    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    return this.agendasRepository
      .createQueryBuilder('agenda')
      .leftJoinAndSelect('agenda.user', 'user')
      .where('agenda.data_inicio >= :dataInicio', { dataInicio })
      .andWhere('agenda.data_inicio <= :dataFim', { dataFim })
      .orderBy('agenda.data_inicio', 'ASC')
      .getMany();
  }
} 