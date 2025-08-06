import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../common/services/hash.service';
import { jwtConfig } from '../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Buscar usuário por email incluindo a senha para validação
    const user = await this.usersService.findByEmail(email, true);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Comparar senha com hash usando bcrypt
    const isPasswordValid = await this.hashService.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT real
    const token = this.generateToken(user);

    return {
      data: {
        user: {
          id: user.id,
          nome: user.nome,
          sobrenome: user.sobrenome,
          email: user.email,
          contato: user.contato,
          avatar: user.avatar,
          descricao: user.descricao,
          status: user.status,
          plano_id: user.plano_id,
        },
        token,
      }
    };
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
      sobrenome: user.sobrenome,
    };
    
    return this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.expiresIn,
    });
  }
} 