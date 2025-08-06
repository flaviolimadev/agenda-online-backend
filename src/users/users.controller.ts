import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users - Criar usuário (sem autenticação para registro)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // GET /users/profile - Obter perfil do usuário logado
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  // GET /users - Listar todos os usuários
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id - Buscar usuário por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // GET /users/email/:email - Buscar usuário por email
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // GET /users/status/:status - Buscar usuários por status
  @Get('status/:status')
  findByStatus(@Param('status', ParseIntPipe) status: number) {
    return this.usersService.findByStatus(status);
  }

  // GET /users/plano/:plano_id - Buscar usuários por plano
  @Get('plano/:plano_id')
  findByPlano(@Param('plano_id', ParseIntPipe) plano_id: number) {
    return this.usersService.findByPlano(plano_id);
  }

  // PATCH /users/:id - Atualizar usuário
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE /users/:id - Remover usuário
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
} 