import { PartialType } from '@nestjs/swagger';
import { ICreateExpense } from './create-expense.interface';

export class IUpdateExpense extends PartialType(ICreateExpense) {}
