import { IsInt, Min } from 'class-validator';
export class CreateComandaDto { 
    @IsInt() usuarioId: number; 
}


export class AdicionarItemDto {
  @IsInt() comandaId: number;
  @IsInt() produtoId: number;
  @IsInt() @Min(1) quantidade: number;
}