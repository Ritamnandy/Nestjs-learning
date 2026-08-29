/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';


@Module( {
  imports: [
    ThrottlerModule.forRoot( {
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    } ),
    ConfigModule.forRoot( {
      isGlobal: true,
    } ),
    AuthModule, PrismaModule, RedisModule, MailModule ],
  controllers: [ AuthController ],
  providers: [],
} )
export class AppModule { }
