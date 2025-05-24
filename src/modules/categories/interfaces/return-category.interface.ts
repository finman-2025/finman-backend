import { PickType } from '@nestjs/swagger';
import { ICategory } from '.';

export class IReturnCategory extends PickType(ICategory, ['name', 'id', 'userId', 'image', 'limit']) { }
