import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe',
    description: 'loginid or user_code (NTid) from econ_customers_drm',
  })
  @IsString()
  @IsNotEmpty()
  loginid!: string; // maps to loginid column (PHP login field)

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password!: string;
}
