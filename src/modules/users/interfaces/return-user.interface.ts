import { PickType } from '@nestjs/swagger';
import { IUser } from './user.interface';

export class IReturnUser extends PickType(IUser, [
    'username',
    'name',
    'email',
    'phoneNumber',
    'sex',
    'dateOfBirth',
    'address',
    'avatar',
]) {}