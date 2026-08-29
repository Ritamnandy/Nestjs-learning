/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { Redis } from 'ioredis';



@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy
{
    private readonly redis: Redis;
    constructor ()
    {
        this.redis = new Redis( {
            host: process.env.REDIS_HOST,
            port: Number( process.env.REDIS_PORT ),
        } )
    }

    async onModuleInit ()
    {
        await this.redis.connect();
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
