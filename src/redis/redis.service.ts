/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Redis } from 'ioredis';



@Injectable()
export class RedisService implements  OnModuleDestroy
{
    private readonly redis: Redis;
    constructor ( private readonly configService: ConfigService, )
    {
        const host = this.configService.getOrThrow<string>( 'REDIS_HOST' );

        const port = Number(
            this.configService.getOrThrow<string>( 'REDIS_PORT' ),
        );

        if ( !Number.isInteger( port ) || port < 0 || port >= 65536 )
        {
            throw new Error( `Invalid REDIS_PORT: ${ port }` );
        }
        this.redis = new Redis( {
            host: host,
            port: port,
        } )
    }

   
    async getCacheData ( key: string )
    {
        return await this.redis.get( key );
    }

    async setCacheData ( key: string, value: string, ttl: number )
    {
        return await this.redis.set( key, value, "EX", ttl );
    }

    async deleteCacheData ( key: string )
    {
        return await this.redis.del( key );
    }

    async onModuleDestroy ()
    {
        await this.redis.quit();
    }



}
