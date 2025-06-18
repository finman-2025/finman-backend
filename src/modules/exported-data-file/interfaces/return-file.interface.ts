import { ApiProperty } from '@nestjs/swagger';

export class IReturnFile {
    @ApiProperty()
    fileName: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    createdAt: Date;
}
