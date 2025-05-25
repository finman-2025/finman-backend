import { PartialType, PickType } from '@nestjs/swagger';
import { ICreateExpense } from './create-expense.interface';

export class IUpdateExpense extends PartialType(ICreateExpense) {}
