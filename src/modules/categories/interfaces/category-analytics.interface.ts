import { ApiProperty, PickType } from '@nestjs/swagger';
import { ICategory } from './category.interface';

class IExpenseValue {
  @ApiProperty()
  spent: number;

  @ApiProperty()
  earned: number;
}

export class ICategoryAnalytics extends PickType(ICategory, [
  'id',
  'name',
  'limit',
]) {
  @ApiProperty({ type: IExpenseValue })
  expenseValue: IExpenseValue;
}
