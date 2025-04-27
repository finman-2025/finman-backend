import { PickType } from "@nestjs/swagger";
import { IUser } from "./user.interface";

export class ILogin extends PickType(IUser, ["username", "password"]) {}