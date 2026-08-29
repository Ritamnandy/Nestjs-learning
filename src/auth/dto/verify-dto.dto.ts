/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyEmailDto
{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsString()
    @IsNotEmpty()
    @Length( 6, 6 )
    otp!: string
}