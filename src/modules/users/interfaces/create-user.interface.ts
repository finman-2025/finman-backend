import { PickType } from "@nestjs/swagger";
import { IUser } from "./user.interface";

export class ICreateUser extends PickType(IUser, [
    'username',
    'name',
    'email',
    'password'
]) {}