/* eslint-disable prettier/prettier */

import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

const generateOtp = () =>
{
    return crypto.randomInt( 100000, 999999 ).toString();
}

const OTP_EXPIRATION = 10 * 60;
const SIGNUP_DATA_EXPIRATION = 60 * 20;

const singUpKey = ( email: string ) =>
{
    return `signUpKey:${ email }`;
}

const OtpKey = ( email: string ) =>
{
    return `otpKey:${ email }`;
}

const hashPassword = async ( password: string ) =>
{
    return await bcrypt.hash( password, 10 );
}

const comparePassword = async ( password: string, hashedPassword: string ) =>
{
    return await bcrypt.compare( password, hashedPassword );
}


export
{
    generateOtp,
    singUpKey,
    OtpKey,
    hashPassword,
    comparePassword,
    OTP_EXPIRATION,
    SIGNUP_DATA_EXPIRATION
}