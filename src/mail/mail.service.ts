/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MAIL_QUEUE } from './mail.constants';

@Injectable()
export class MailService
{
    private Options = {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    }
    constructor (
        @InjectQueue( MAIL_QUEUE )
        private readonly mailQueue: Queue
    ) { }
    async sendWellcomeMail ( email: string, name: string )
    {
        await this.mailQueue.add( 'sendWellcomeEmail', { email, name }, this.Options );
    }

    async sendVerifyEmailMail ( email: string, token: string )
    {
        await this.mailQueue.add( 'sendVerifyEmailMail', { email, token }, this.Options );
    }
    async sendResetPasswordMail ( email: string, link: string )
    {
        await this.mailQueue.add( 'sendResetPasswordMail', { email, link }, this.Options );
    }

    async sendPasswordChangedMail ( email: string )
    {
        await this.mailQueue.add( 'sendPasswordChangedMail', { email }, this.Options );
    }

}
