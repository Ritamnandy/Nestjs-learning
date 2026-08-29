/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";


export class RegisterDtoDto
{
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password!: string;
}
