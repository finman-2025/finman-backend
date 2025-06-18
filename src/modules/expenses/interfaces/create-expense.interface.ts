import { OmitType, PickType } from '@nestjs/swagger';
import { IExpense } from './expense.interface';

export class ICreateExpense extends OmitType(IExpense, ['id']) {}
