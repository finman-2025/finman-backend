import { ApiProperty, PickType } from '@nestjs/swagger';
import { IExpense } from './expense.interface';
import { ICategory } from 'src/modules/categories/interfaces';

class IRefCategory extends PickType(ICategory, ['id', 'name']) {}

export class IReturnExpense extends PickType(IExpense, [
  'id',
  'value',
  'description',
  'date',
]) {
  @ApiProperty({ type: IRefCategory })
  category: IRefCategory;
}
