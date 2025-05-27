import { ApiProperty } from '@nestjs/swagger';

export class IChangePassword {
    @ApiProperty()
    username: string;

    @ApiProperty()
    oldPassword: string;

    @ApiProperty()
    newPassword: string;
}
