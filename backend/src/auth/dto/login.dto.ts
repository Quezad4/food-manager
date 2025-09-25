import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {

  @ApiProperty({example: "deboracorreia"})
  @IsString() user: string;
  
  @ApiProperty({example: "12345678"})
  @IsString() senha: string;
}