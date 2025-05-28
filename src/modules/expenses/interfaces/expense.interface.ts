import { ApiProperty } from '@nestjs/swagger';
import { ExpenseType } from '@prisma/client';

export class IExpense {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: ExpenseType,
    description: `type: ${ExpenseType.INCOME} | ${ExpenseType.OUTCOME}`,
  })
  type: ExpenseType;

  @ApiProperty()
  value: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  categoryId: number;


  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isDeleted: boolean;
}
