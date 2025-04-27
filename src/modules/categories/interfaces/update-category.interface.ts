import { PartialType } from '@nestjs/swagger';
import { ICreateCategory } from '.';

export class IUpdateCategory extends PartialType(ICreateCategory) {}
