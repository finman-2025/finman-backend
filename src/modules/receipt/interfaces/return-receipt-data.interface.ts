import { ApiProperty } from "@nestjs/swagger";

export class IReturnReceiptData {
    @ApiProperty()
    merchant: string;

    @ApiProperty()
    total: number;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    category: string;
}