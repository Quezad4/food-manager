import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {

  @ApiProperty({example: "admin"})
  @IsString() user: string;
  
  @ApiProperty({example: "admin"})
  @IsString() senha: string;
}