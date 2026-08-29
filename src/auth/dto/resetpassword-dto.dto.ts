/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordDtoDto
{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    token!: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    newPassword!: string
}