import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import Decimal from 'decimal.js';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @Type(() => Decimal)
  @IsNumber({ maxDecimalPlaces: 2 })
  preco: number;
}
 