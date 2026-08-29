/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RedisService } from './../redis/redis.service';
import type { MailService } from '../mail/mail.service';
import { AuthRepository } from './auth.repository';
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { JsonWebTokenError, type JwtService } from '@nestjs/jwt';

import type { RegisterDtoDto } from './dto/register-dto.dto';
import { comparePassword, generateOtp, hashPassword, OTP_EXPIRATION, OtpKey, singUpKey } from './constants';
import type { JwtPayload, RefreshTokenPayload } from './types/jwt-payload';
import type { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
@Injectable()
export class AuthService
{

    private generateTokens ( payload: JwtPayload, rpayload: RefreshTokenPayload )
    {
        try
        {
            const accessToken = this.jwtService.sign( payload, {
                secret: this.configService.getOrThrow<string>( 'JWT_SECRET' ),
                expiresIn: this.configService.getOrThrow<string>( 'JWT_EXPIRATION' ) as StringValue,
            } );

            const refreshToken = this.jwtService.sign( rpayload, {
                secret: this.configService.getOrThrow<string>( 'REFRESH_TOKEN_SECRET' ),
                expiresIn: this.configService.getOrThrow<string>( 'REFRESH_TOKEN_EXPIRATION' ) as StringValue,
            } );

            return { accessToken, refreshToken };
        } catch ( error )
        {
            if ( error instanceof JsonWebTokenError )
            {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                throw new Error( error.message );
            }
            throw new Error( error as string );
        }
    }

    constructor (
        private readonly authRepository: AuthRepository, private readonly mailService: MailService,
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async registerUser ( data: RegisterDtoDto )
    {
        try
        {
            const user = await this.authRepository.findUserByEmail( data.email );
            if ( user )
            {
                throw new BadRequestException( 'User already exists' );
            }
            const otp = generateOtp();

            await this.redisService.setCacheData( OtpKey( data.email ), otp, OTP_EXPIRATION );

            await this.redisService.setCacheData( singUpKey( data.email ), JSON.stringify( data ), OTP_EXPIRATION );

            await this.mailService.sendVerifyEmailMail( data.email, otp );


        } catch ( error )
        {
            console.log( error );

        }
    }

    async resendOtpCode ( email: string )
    {
        const cacheData = await this.redisService.getCacheData( singUpKey( email ) );
        if ( !cacheData )
        {
            throw new BadRequestException( 'Register session expired please register again' );
        }
        const otp = generateOtp();
        await this.redisService.setCacheData( OtpKey( email ), otp, OTP_EXPIRATION );
        await this.mailService.sendVerifyEmailMail( email, otp );
    }

    async verifyEmail ( email: string, otp: string )
    {
        try
        {
            const cacheData = await this.redisService.getCacheData( singUpKey( email ) );
            if ( !cacheData )
            {
                throw new BadRequestException( 'Register session expired please register again' );
            }

            const cacheOtp = await this.redisService.getCacheData( OtpKey( email ) );

            if ( !cacheOtp )
            {
                throw new BadRequestException( 'Register session expired please register again' );
            }

            if ( cacheOtp !== otp )
            {
                throw new BadRequestException( 'Invalid otp please try again' );
            }

            const data = JSON.parse( cacheData ) as RegisterDtoDto;
            const hashPass = await hashPassword( data.password );

            const user = await this.authRepository.createUser( { ...data, password: hashPass } );

            if ( !user )
            {
                throw new BadRequestException( 'Please enter valid details' );
            }
            const jwtpayload: JwtPayload = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
            const refreshTokenPayload: RefreshTokenPayload = {
                id: user.id,
                email: user.email
            }
            const { accessToken, refreshToken } = this.generateTokens( jwtpayload, refreshTokenPayload );

            await this.authRepository.setRefreshToken( user.id, refreshToken as string );

            return {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        } catch ( error )
        {
            console.log( error );
            return {}
        }
    }

    async loginUser ( email: string, password: string )
    {
        const user = await this.authRepository.findWhenLogin( email );
        if ( !user )
        {
            throw new BadRequestException( 'User not found' );
        }
        const isPasswordCorrect = await comparePassword( password, user.password );

        if ( !isPasswordCorrect )
        {
            throw new BadRequestException( 'Please enter correct password' );
        }
        const jwtpayload: JwtPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
        const refreshTokenPayload: RefreshTokenPayload = {
            id: user.id,
            email: user.email
        }
        const { accessToken, refreshToken } = this.generateTokens( jwtpayload, refreshTokenPayload );

        await this.authRepository.setRefreshToken( user.id, refreshToken as string );

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl
            },
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async logoutUser ( id: string )
    {

        return await this.authRepository.deleteUser( id );
    }

    async refreshAccessToken ( refreshToken: string )
    {
        try
        {
            const payload: RefreshTokenPayload = await this.jwtService.verifyAsync( refreshToken, {
                secret: this.configService.getOrThrow<string>( 'REFRESH_TOKEN_SECRET' ),
                ignoreExpiration: false
            } );

            const user = await this.authRepository.findWhenLogin( payload.email );
            if ( !user )
            {
                throw new BadRequestException( 'User not found' );
            }
            if ( user.refreshToken !== refreshToken )
            {
                throw new BadRequestException( 'Invalid refresh token' );
            }
            const jwtpayload: JwtPayload = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
            const { accessToken } = this.generateTokens( jwtpayload, payload );
            return {
                accessToken: accessToken
            }
        } catch ( error )
        {
            console.log( error );

        }

    }




}
