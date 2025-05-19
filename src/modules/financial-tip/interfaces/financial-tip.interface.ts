import { ApiProperty } from "@nestjs/swagger";

export class IFinancialTip {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    author: string;

    @ApiProperty()
    authorImage: string;

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
}