import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phoneNumber: string;

  @ApiPropertyOptional()
  sex: string;

  @ApiPropertyOptional()
  dateOfBirth: Date;

  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  avatar: string;
}
