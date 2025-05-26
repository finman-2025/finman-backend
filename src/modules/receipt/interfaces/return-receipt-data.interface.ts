import { ApiProperty } from "@nestjs/swagger";

export class IReturnReceiptData {
    @ApiProperty()
    seller: string;

    @ApiProperty()
    value: number;

    @ApiProperty()
    date: string;
}