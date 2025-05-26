import { ApiProperty } from '@nestjs/swagger';

export class IExportExpenses {
    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty({ enum: ['csv', 'pdf'] })
    fileType: 'csv' | 'pdf';
}
