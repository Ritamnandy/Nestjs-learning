/* eslint-disable prettier/prettier */
import
{
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import type { JwtPayload } from '../types/jwt-payload';
@Injectable()
export class AuthGuard implements CanActivate
{
    constructor ( private readonly jwtService: JwtService ) { }

    async canActivate ( context: ExecutionContext ): Promise<boolean>
    {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader( request );
        if ( !token )
        {
            throw new UnauthorizedException('Please provide access token');
        }
        try
        {

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const payload:JwtPayload = await this.jwtService.verifyAsync( token );

            request[ 'user' ] = payload;
        } catch
        {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader ( request: Request ): string | undefined
    {
        const [ type, token ] = request.headers.authorization?.split( ' ' ) ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
