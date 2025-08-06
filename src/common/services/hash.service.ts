import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds = 12;

  /**
   * Gera um hash da senha usando bcrypt
   * @param password - Senha em texto plano
   * @returns Promise<string> - Hash da senha
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara uma senha em texto plano com um hash
   * @param password - Senha em texto plano
   * @param hash - Hash da senha
   * @returns Promise<boolean> - True se as senhas coincidem
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Verifica se uma string é um hash válido
   * @param hash - String para verificar
   * @returns boolean - True se é um hash válido
   */
  isHash(hash: string): boolean {
    return hash.startsWith('$2b$') || hash.startsWith('$2a$');
  }
} 