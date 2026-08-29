/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guard/guard';



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
        AuthGuard,
    ],
    controllers: [ AuthController ],
} )
export class AuthModule { }
