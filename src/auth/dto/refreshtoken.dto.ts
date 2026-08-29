/* eslint-disable prettier/prettier */

import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto
{
    @IsString()
    @IsNotEmpty()
    @IsJWT()
    refreshToken!: string;
}