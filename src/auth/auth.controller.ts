import { LoginDtoDto } from './dto/login-dto.dto';
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, HttpStatus, HttpCode, BadRequestException, UseGuards, Req } from '@nestjs/common';
import type { AuthService } from './auth.service';
import type { RegisterDtoDto } from './dto/register-dto.dto';
import type { ResendDtoDto } from './dto/resend-dto.dto';
import type { VerifyEmailDto } from './dto/verify-dto.dto';
import { AuthGuard } from './guard/guard';
import type { RefreshTokenDto } from './dto/refreshtoken.dto';
import type { Request } from 'express';

interface RequestWithUser extends Request
{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string
    }
}



@Controller( 'auth' )
export class AuthController
{
    constructor ( private readonly authService: AuthService ) { }

    @HttpCode( HttpStatus.ACCEPTED )
    @Post( 'register' )
    async registerUser ( @Body() data: RegisterDtoDto, ): Promise<{ message: string }>
    {
        await this.authService.registerUser( data );
        return { message: 'Verification code sent to your email, please check and verify' }
    }

    @HttpCode( HttpStatus.ACCEPTED )
    @Post( 'resendcode' )
    async resendOtpcode ( @Body() data: ResendDtoDto, ): Promise<{ message: string }>
    {
        await this.authService.resendOtpCode( data.email );
        return { message: 'Verification code sent to your email, please check and verify' }
    }
    @HttpCode( HttpStatus.CREATED )
    @Post( 'verifyemail' )
    async verifyEmail ( @Body() data: VerifyEmailDto, ): Promise<{ message: string, data: object }>
    {
        const response = await this.authService.verifyEmail( data.email, data.otp );
        return { message: 'Email verified successfully', data: response }
    }

    @HttpCode( HttpStatus.CREATED )
    @Post( 'login' )
    async loginUser ( @Body() data: LoginDtoDto, ): Promise<{ message: string, data: object }>
    {
        const response = await this.authService.loginUser( data.email, data.password );
        return { message: 'Login successful', data: response }
    }

    @HttpCode( HttpStatus.OK )
    @Post( 'logout' )
    @UseGuards( AuthGuard )
    async logoutUser ( @Req() req: RequestWithUser ): Promise<{ message: string }>
    {
        await this.authService.logoutUser( req.user.id );
        return { message: 'User logout successfully' }
    }

    @HttpCode( HttpStatus.OK )
    @Post( 'refresh-accesstoken' )
    async refreshAccessToken ( @Body() data: RefreshTokenDto, ): Promise<{ message: string, data: object }>
    {
        const response = await this.authService.refreshAccessToken( data.refreshToken );
        if ( !response )
        {
            throw new BadRequestException( 'Invalid refresh token' );
        }
        return { message: 'User logout successfully', data: response }
    }


    @HttpCode( HttpStatus.OK )
    @Get( 'me' )
    @UseGuards( AuthGuard )
    getDetails ( @Req() req: RequestWithUser )
    {
        return { message: 'User logout successfully', user: req.user }
    }


}
