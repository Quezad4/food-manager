import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
export class CreateUsuarioDto {

    @ApiProperty({example: "Mateus Quezada"})
    @IsString()
    nome: string;

    @ApiPropertyOptional({example: "Atendente"})
    @IsOptional()
    @IsString()
    cargo?: string;

    @ApiPropertyOptional({example: "62996513545)"})
    @IsOptional()
    @IsPhoneNumber('BR')
    telefone?: string;

    @ApiPropertyOptional({example: "/home/quezada/Imagens/foto de usuario.png"})
    @IsOptional()
    @IsString()
    foto?: string;

    @ApiProperty({example: "mateusquezada"})
    @IsString() 
    user: string;

    @ApiProperty({example: "123456"})
    @IsString() 
    @MinLength(6) 
    senha: string;

    @ApiProperty({example: false, description: "Valor booleano"})
    @IsBoolean() 
    isAdmin?: boolean;
}