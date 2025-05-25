import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseType } from '@prisma/client';

export class IExpense {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: ExpenseType;

  @ApiProperty()
  value: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  categoryId: number;
}
