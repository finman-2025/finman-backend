import { PickType } from "@nestjs/swagger";
import { IFinancialTip } from "./financial-tip.interface";

export class ICreateFinancialTip extends PickType(IFinancialTip, [
    'author',
    'authorImage',
    'content',
    'title',
    'type',
    'date'
]) {}