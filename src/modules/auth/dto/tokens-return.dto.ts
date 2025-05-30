import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(acessToken: string, refreshToken: string) {
    this.accessToken = acessToken;
    this.refreshToken = refreshToken;
  }
}
