import { ApiProperty } from "@nestjs/swagger";

export class IResponseMessage {
    @ApiProperty()
    message: string;
}
