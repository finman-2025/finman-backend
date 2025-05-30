import { ApiProperty } from '@nestjs/swagger';

export class IRefresh {
  @ApiProperty()
  refreshToken: string;
}
