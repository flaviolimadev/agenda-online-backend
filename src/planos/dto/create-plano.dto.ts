import { IsString, IsNumber, IsBoolean, IsOptional, MinLength, MaxLength, Min, IsPositive } from 'class-validator';

export class CreatePlanoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsNumber()
  @Min(1)
  tempo: number;
} 