import { IsBoolean, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
export class CreateUsuarioDto {
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    cargo?: string;

    @IsOptional()
    @IsPhoneNumber('BR')
    telefone?: string;

    @IsOptional()
    @IsString()
    foto?: string;

    @IsString() 
    user: string;

    @IsString() 
    @MinLength(6) 
    senha: string;

    @IsOptional() 
    @IsBoolean() 
    isAdmin?: boolean;
}