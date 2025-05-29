import { ApiProperty } from '@nestjs/swagger';

export class IExportedDataFile {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  fileType: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isDeleted: boolean;
}
