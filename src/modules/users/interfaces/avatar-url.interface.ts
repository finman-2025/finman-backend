import { PickType } from "@nestjs/swagger";
import { IUser } from "./user.interface";

export class IAvatarUrl extends PickType(IUser, ['avatar']) {}