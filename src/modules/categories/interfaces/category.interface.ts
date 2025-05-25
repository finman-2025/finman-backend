import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ICategory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  limit?: number;
}
