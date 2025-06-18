import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { ICategory } from '.';

export class ICreateCategory extends PickType(ICategory, [
  'name',
  'limit',
  'type',
]) {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'JPG or JPEG or PNG, max 5MB',
  })
  image?: Express.Multer.File;
}
