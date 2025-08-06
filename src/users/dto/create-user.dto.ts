import { IsString, IsEmail, IsOptional, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nome: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  sobrenome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  contato: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsNumber()
  plano_id?: number;
} 