/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt-strategies';

import { RedisModule } from '../redis/redis.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.sarategis';

import { JwtModule } from '@nestjs/jwt';



@Module( {
    imports: [
        PrismaModule,
        RedisModule,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        JwtModule.register( {
            global: true,

        } ),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        RefreshTokenStrategy,
    ],
    controllers: [ AuthController ],
} )
export class AuthModule { }
