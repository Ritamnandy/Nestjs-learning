/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../types/jwt-payload';


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy, 'jwt' ) {
    constructor ( private readonly configService: ConfigService )
    {
        
        super( {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>( 'JWT_SECRET' ),
        } )
    }

    validate ( payload: JwtPayload )
    {
        if ( !payload || !payload.id || !payload.email )
        {
            throw new UnauthorizedException( 'Please log in to continue' );
        }
        return payload;
    }



}
