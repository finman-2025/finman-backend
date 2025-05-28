import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseType } from '@prisma/client';

export class ICategory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ enum: ExpenseType })
  type: ExpenseType;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  limit?: number;
}
