import { PickType } from "@nestjs/swagger";
import { IUser } from "./user.interface";

export class IUpdateUser extends PickType(IUser, [
    "name",
    "email",
    "phoneNumber"
]) {}