/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { MAIL_QUEUE } from './mail.constants';
import type { sendVerifyEmailMailData, wellComeEmailData } from './types/job-types';


@Processor( MAIL_QUEUE )
export class MailProcessor extends WorkerHost
{
    private readonly transporter;
    private readonly mailGenerator;
    constructor ()
    {
        super();
        this.transporter = nodemailer.createTransport( {
            auth: {
                user: process.env.APP_EMAIL as string,
                pass: process.env.APP_PASSWORD as string,
            },
        } )

        this.mailGenerator = new Mailgen( {
            theme: 'default',
            product: {
                name: 'Todo App',
                link: 'https://mailgen.js/'
            }
        } );

    }

    async process ( job: Job )
    {
        switch ( job.name )
        {
            case 'welcome-email':
                await this.sendWelcomeEmail( job );
                break;
            case 'sendVerifyEmailMail':
                return this.sendVerifyEmailMail( job );

            case 'sendResetPasswordMail':
                return this.sendResetPasswordMail( job );

            case 'sendPasswordChangedMail':
                return this.sendPasswordChangedMail( job );
            default:
                throw new Error( `Unknown mail job: ${ job.name }` );
        }
    }
    private async sendWelcomeEmail ( job: Job )
    {
        const { email, name } = job.data as wellComeEmailData;
        const emailBody = {
            body: {
                name,

                intro: 'Welcome to My App!',

                action: {
                    instructions:
                        'You can now start using your account.',
                    button: {
                        text: 'Visit My App',
                        link: 'https://example.com',
                    },
                },

                outro:
                    'If you have any questions, feel free to contact us.',
            },
        };

        const emailHtml = this.mailGenerator.generate( emailBody );
        const text = this.mailGenerator.generatePlaintext( emailBody )

        await this.transporter.sendMail( {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'Welcome to My App',
            html: emailHtml,
            text,
        } );

    }


    // ─────────────────────────────────────
    // Verify Email
    // ─────────────────────────────────────

    private async sendVerifyEmailMail ( job: Job )
    {
        const { email, token } = job.data as sendVerifyEmailMailData;
        const emailBody = {
            body: {
                name: email,

                intro: 'Welcome to My App!',

                action: {
                    instructions:
                        'Please verify your email address by clicking the button below:',

                    button: {
                        color: '#22BC66',
                        text: token,
                        link: "#",
                    },
                },

                outro:
                    'If you did not create this account, you can safely ignore this email.',
            },
        };

        const html = this.mailGenerator.generate( emailBody );
        const text =
            this.mailGenerator.generatePlaintext( emailBody );

        await this.transporter.sendMail( {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'Verify your email address',
            html,
            text,
        } );
    }

    // ─────────────────────────────────────
    // Reset Password
    // ─────────────────────────────────────

    private async sendResetPasswordMail ( job: Job )
    {
        const { email, link } = job.data;

        const emailBody = {
            body: {
                name: email,

                intro:
                    'We received a request to reset your password.',

                action: {
                    instructions:
                        'Click the button below to create a new password:',

                    button: {
                        color: '#22BC66',
                        text: 'Reset Password',
                        link,
                    },
                },

                outro:
                    'If you did not request a password reset, you can safely ignore this email.',
            },
        };

        const html = this.mailGenerator.generate( emailBody );
        const text =
            this.mailGenerator.generatePlaintext( emailBody );

        await this.transporter.sendMail( {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'Reset your password',
            html,
            text,
        } );
    }

    // ─────────────────────────────────────
    // Password Changed
    // ─────────────────────────────────────

    private async sendPasswordChangedMail ( job: Job )
    {
        const { email } = job.data;

        const emailBody = {
            body: {
                name: email,

                intro:
                    'Your password has been changed successfully.',

                outro:
                    'If you did not make this change, please contact support immediately.',
            },
        };

        const html = this.mailGenerator.generate( emailBody );
        const text =
            this.mailGenerator.generatePlaintext( emailBody );

        await this.transporter.sendMail( {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'Your password was changed',
            html,
            text,
        } );
    }

}
