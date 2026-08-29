/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq'
import { MAIL_QUEUE } from './mail.constants';
@Module( {
  imports: [
    BullModule.forRoot( {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number( process.env.REDIS_PORT ),
      }
    } ),
    BullModule.registerQueue( {
      name: MAIL_QUEUE,
    } )
  ],
  providers: [ MailService ],
  exports: [ MailService ]
} )
export class MailModule { }
