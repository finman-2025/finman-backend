import { PickType } from "@nestjs/swagger";
import { IRegister } from "./register.interface";

export class ILogin extends PickType(IRegister, ["username", "password"]) {}