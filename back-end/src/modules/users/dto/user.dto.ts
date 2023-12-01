import { IsEmail, IsNotEmpty, MinLength, Validate } from "class-validator";
import { IsStrong } from "../../../core/pipes/isStrong.pipe";

export class UserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @Validate(IsStrong)
    @MinLength(8)
    readonly password: string;
}