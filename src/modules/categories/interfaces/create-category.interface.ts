import { PickType } from '@nestjs/swagger';
import { ICategory } from '.';

export class ICreateCategory extends PickType(ICategory, [
  'name',
  'limit',
  'image',
  'type',
]) {}
