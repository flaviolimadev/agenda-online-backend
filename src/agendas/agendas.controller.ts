import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AgendasService } from './agendas.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('agendas')
@UseGuards(JwtAuthGuard)
export class AgendasController {
  constructor(private readonly agendasService: AgendasService) {}

  // POST /agendas - Criar agenda
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAgendaDto: CreateAgendaDto, @GetUser() user: any) {
    return this.agendasService.create({ ...createAgendaDto, user_id: user.id });
  }

  // GET /agendas - Listar todas as agendas
  @Get()
  findAll() {
    return this.agendasService.findAll();
  }

  // GET /agendas/:id - Buscar agenda por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agendasService.findOne(id);
  }

  // GET /agendas/user/:user_id - Buscar agendas por usuário
  @Get('user/:user_id')
  findByUser(@Param('user_id', ParseIntPipe) user_id: number, @GetUser() user: any) {
    // Verificar se o usuário está tentando acessar suas próprias agendas
    if (user_id !== user.id) {
      throw new Error('Não autorizado');
    }
    return this.agendasService.findByUser(user_id);
  }

  // GET /agendas/status/:status - Buscar agendas por status
  @Get('status/:status')
  findByStatus(@Param('status', ParseIntPipe) status: number) {
    return this.agendasService.findByStatus(status);
  }

  // GET /agendas/ativas - Buscar agendas ativas
  @Get('ativas')
  findAtivas() {
    return this.agendasService.findAtivas();
  }

  // GET /agendas/pendentes - Buscar agendas pendentes
  @Get('pendentes')
  findPendentes() {
    return this.agendasService.findPendentes();
  }

  // GET /agendas/data/:data - Buscar agendas por data específica
  @Get('data/:data')
  findByDate(@Param('data') data: string) {
    return this.agendasService.findByDate(data);
  }

  // GET /agendas/periodo - Buscar agendas por período
  @Get('periodo')
  findByPeriod(
    @Query('data_inicio') data_inicio: string,
    @Query('data_termino') data_termino: string,
  ) {
    return this.agendasService.findByPeriod(data_inicio, data_termino);
  }

  // PATCH /agendas/:id - Atualizar agenda
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAgendaDto: UpdateAgendaDto, @GetUser() user: any) {
    // Verificar se a agenda pertence ao usuário
    const agenda = await this.agendasService.findOne(id);
    if (agenda.user_id !== user.id) {
      throw new Error('Não autorizado');
    }
    return this.agendasService.update(id, updateAgendaDto);
  }

  // DELETE /agendas/:id - Remover agenda
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    // Verificar se a agenda pertence ao usuário
    const agenda = await this.agendasService.findOne(id);
    if (agenda.user_id !== user.id) {
      throw new Error('Não autorizado');
    }
    return this.agendasService.remove(id);
  }
} 