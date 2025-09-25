import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';


export class CreateComandaDto {
  @ApiProperty({example: 1})
  @IsInt() usuarioId: number;
}


export class AdicionarItemDto {
  @ApiProperty({example: 1})
  @IsInt() comandaId: number;

  @ApiProperty({example: 1})
  @IsInt() produtoId: number;

  @ApiProperty({example: 3})
  @IsInt() @Min(1) quantidade: number;
}