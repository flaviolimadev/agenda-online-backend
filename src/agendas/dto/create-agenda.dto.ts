import { IsString, IsNumber, IsOptional, IsDateString, MinLength, MaxLength, IsPositive } from 'class-validator';

export class CreateAgendaDto {
  @IsNumber()
  @IsPositive()
  user_id: number;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsDateString()
  data_inicio?: string;

  @IsOptional()
  @IsDateString()
  data_termino?: string;

  @IsOptional()
  @IsString()
  hora_inicio?: string;

  @IsOptional()
  @IsString()
  hora_termino?: string;

  @IsOptional()
  @IsString()
  local?: string;

  @IsOptional()
  @IsNumber()
  status?: number;
} 