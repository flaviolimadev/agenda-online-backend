import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  // POST /planos - Criar plano
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planosService.create(createPlanoDto);
  }

  // GET /planos - Listar todos os planos
  @Get()
  findAll() {
    return this.planosService.findAll();
  }

  // GET /planos/ativos - Listar apenas planos ativos
  @Get('ativos')
  findAtivos() {
    return this.planosService.findAtivos();
  }

  // GET /planos/:id - Buscar plano por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.findOne(id);
  }

  // GET /planos/valor/:value - Buscar planos por valor
  @Get('valor/:value')
  findByValue(@Param('value', ParseIntPipe) value: number) {
    return this.planosService.findByMaxValue(value);
  }

  // GET /planos/tempo/:tempo - Buscar planos por tempo
  @Get('tempo/:tempo')
  findByTempo(@Param('tempo', ParseIntPipe) tempo: number) {
    return this.planosService.findByTempo(tempo);
  }

  // PATCH /planos/:id - Atualizar plano
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanoDto: UpdatePlanoDto) {
    return this.planosService.update(id, updatePlanoDto);
  }

  // PATCH /planos/:id/toggle - Ativar/Desativar plano
  @Patch(':id/toggle')
  toggleAtivo(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.toggleAtivo(id);
  }

  // DELETE /planos/:id - Remover plano
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planosService.remove(id);
  }
} 