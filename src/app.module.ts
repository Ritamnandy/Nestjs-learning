/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { MailModule } from './mail/mail.module';
@Module( {
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true,
    } ),
    AuthModule, PrismaModule, RedisModule, MailModule ],
  controllers: [ AuthController ],
  providers: [],
} )
export class AppModule { }
