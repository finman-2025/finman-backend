import { PickType } from "@nestjs/swagger";
import { IExpense } from "./expense.interface";

export class ICreateExpense extends PickType(IExpense, [
    "value",
    "description",
    "date",
    "userId",
    "categoryId",
]) {}
