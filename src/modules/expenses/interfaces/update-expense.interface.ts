import { PickType } from "@nestjs/swagger";
import { IExpense } from "./expense.interface";

export class IUpdateExppense extends PickType(IExpense, [
    "value",
    "description",
    "date",
    "categoryId",
]) {}