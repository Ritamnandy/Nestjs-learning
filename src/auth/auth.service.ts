/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RedisService } from './../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { AuthRepository } from './auth.repository';
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import {  JwtService } from '@nestjs/jwt';

import type { RegisterDtoDto } from './dto/register-dto.dto';
import { comparePassword, generateOtp, hashPassword, OTP_EXPIRATION, OtpKey, singUpKey } from './constants';
import type { JwtPayload, RefreshTokenPayload } from './types/jwt-payload';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
@Injectable()
export class AuthService
{

    private async generateTokens ( payload: JwtPayload, rpayload: RefreshTokenPayload )
    {

        const accessToken = this.jwtService.sign( payload, {
            secret: this.configService.getOrThrow<string>( 'JWT_SECRET' ),
            expiresIn: this.configService.getOrThrow<string>( 'JWT_EXPIRATION_TIME' ) as StringValue,
        } );

        const refreshToken = this.jwtService.sign( rpayload, {
            secret: this.configService.getOrThrow<string>( 'REFRESH_TOKEN_SECRET' ),
            expiresIn: this.configService.getOrThrow<string>( 'REFRESH_TOKEN_EXPIRATION_TIME' ) as StringValue,
        } );
        await this.authRepository.setRefreshToken( payload.id, refreshToken )
        return { accessToken, refreshToken };

    }

    constructor (
        private readonly authRepository: AuthRepository,
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) { }

    async registerUser ( data: RegisterDtoDto )
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
        const { accessToken, refreshToken } = await this.generateTokens( jwtpayload, refreshTokenPayload );

        return {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
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
        const { accessToken, refreshToken } = await this.generateTokens( jwtpayload, refreshTokenPayload );



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
        const { accessToken, refreshToken: ref } = await this.generateTokens( jwtpayload, payload );
        return {
            accessToken: accessToken,
            refreshToken: ref
        }


    }




}
