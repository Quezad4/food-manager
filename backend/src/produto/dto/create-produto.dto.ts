import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import Decimal from 'decimal.js';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({example: "Batata frita"})
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({example:"Porção de Batata Frita 500g"})
  @IsString()
  @IsOptional()
  descricao?: string;
  
  @ApiProperty({ example: 32.00, description: 'Usar decimal de até duas casas decimais' })
  @Type(() => Decimal)
  @IsNumber({ maxDecimalPlaces: 2 })
  preco: number;
}
  