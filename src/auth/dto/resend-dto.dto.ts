/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResendDtoDto
{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string
}