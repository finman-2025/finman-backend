import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IFinancialTip {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  author: string;

  @ApiPropertyOptional()
  authorImage?: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  type: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isDeleted: boolean;
}
