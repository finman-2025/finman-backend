import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionDto {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  message: string;
}
