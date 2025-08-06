import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../common/services/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  // CREATE - Criar usuário
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar se email já existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Criptografar a senha antes de salvar
    const hashedPassword = await this.hashService.hashPassword(createUserDto.password);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      status: createUserDto.status || 0,
    });

    return this.usersRepository.save(user);
  }

  // READ - Buscar todos os usuários
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'nome', 'sobrenome', 'email', 'contato', 'avatar', 'descricao', 'status', 'plano_id', 'created_at', 'updated_at'],
    });
  }

  // READ - Buscar usuário por ID
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'nome', 'sobrenome', 'email', 'contato', 'avatar', 'descricao', 'status', 'plano_id', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  // READ - Buscar usuário por email
  async findByEmail(email: string, includePassword = false): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: includePassword 
        ? ['id', 'nome', 'sobrenome', 'email', 'password', 'contato', 'avatar', 'descricao', 'status', 'plano_id', 'created_at', 'updated_at']
        : ['id', 'nome', 'sobrenome', 'email', 'contato', 'avatar', 'descricao', 'status', 'plano_id', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    return user;
  }

  // UPDATE - Atualizar usuário
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Se estiver atualizando email, verificar se já existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Se estiver atualizando a senha, criptografar
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  // DELETE - Remover usuário
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // Buscar usuários por status
  async findByStatus(status: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { status },
      select: ['id', 'nome', 'sobrenome', 'email', 'contato', 'avatar', 'descricao', 'status', 'plano_id', 'created_at', 'updated_at'],
    });
  }

  // Buscar usuários por plano
  async findByPlano(plano_id: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { plano_id },
      select: ['id', 'nome', 'sobrenome', 'email', 'contato', 'avatar', 'descricao', 'status', 'plano_id', 'created_at', 'updated_at'],
    });
  }
} 