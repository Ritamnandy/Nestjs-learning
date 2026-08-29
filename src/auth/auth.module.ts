/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guard/guard';
import { AuthRepository } from './auth.repository';

import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';



@Module( {
    imports: [
        PrismaModule,
        RedisModule,
        ConfigModule,
        MailModule,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        JwtModule.register( {
            global: true,

        } ),

    ],
    providers: [
        AuthService,
        AuthGuard,
        AuthRepository,
    ],
    controllers: [ AuthController ],
} )
export class AuthModule { }
