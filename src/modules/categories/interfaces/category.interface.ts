import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseType } from '@prisma/client';

export class ICategory {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({
    enum: ExpenseType,
    description: `type: ${ExpenseType.INCOME} | ${ExpenseType.OUTCOME}`,
  })
  type?: ExpenseType;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  limit?: number;
}
