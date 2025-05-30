import { ApiProperty } from "@nestjs/swagger";

export class IRegister {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;
}