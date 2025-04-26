import { ApiProperty } from "@nestjs/swagger";

export class IExpense {
    @ApiProperty()
    id: number;

    @ApiProperty()
    value: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;
    
    @ApiProperty()
    userId: number;

    @ApiProperty()
    categoryId: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}