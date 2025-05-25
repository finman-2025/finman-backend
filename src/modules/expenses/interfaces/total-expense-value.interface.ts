import { ApiProperty } from '@nestjs/swagger';

export class ITotalExpenseValue {
  @ApiProperty()
  spent: number;

  @ApiProperty()
  earned: number;
}
