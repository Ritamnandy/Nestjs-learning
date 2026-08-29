/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [RedisService,ConfigModule,],
  exports: [RedisService],
})
export class RedisModule {}
