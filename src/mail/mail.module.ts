/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq'
import { MAIL_QUEUE } from './mail.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailProcessor } from './mail.processor';
@Module( {
  imports: [
    BullModule.forRootAsync( {
      imports: [ ConfigModule ],
      inject: [ ConfigService ],

      useFactory: ( configService: ConfigService ) => ( {
        connection: {
          host: configService.getOrThrow<string>( 'REDIS_HOST' ),
          port: Number(
            configService.getOrThrow<string>( 'REDIS_PORT' ),
          ),
        },
      } ),
    } ),

    BullModule.registerQueue( {
      name: MAIL_QUEUE,
    } )
  ],
  providers: [ MailService, MailProcessor ],
  exports: [ MailService,  ]
} )
export class MailModule { }
