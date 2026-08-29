/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Strategies } from './strategies/strategies';
import { RedisModule } from '../redis/redis.module';


@Module( {
    imports: [ PrismaModule, RedisModule ],
    providers: [ AuthService, Strategies ],
    controllers: [ AuthController ]
} )
export class AuthModule { }
