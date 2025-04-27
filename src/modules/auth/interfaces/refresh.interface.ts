import { ApiProperty } from "@nestjs/swagger";

export class IRefresh {
    @ApiProperty()
    username: string;

    @ApiProperty()
    refreshToken: string;
}