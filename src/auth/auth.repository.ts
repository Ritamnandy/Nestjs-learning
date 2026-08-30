/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDtoDto } from "./dto/register-dto.dto";

@Injectable()
export class AuthRepository
{
    private SelectedOption = {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
    }
    constructor ( private readonly prisma: PrismaService ) { }

    async createUser ( data: RegisterDtoDto, )
    {
        // console.log(data);

        try
        {
            return await this.prisma.user.create( {
                data: {
                    ...data,
                },
                omit: {
                    password: true,
                    refreshToken: true,
                    userStatus: true
                }
            } )
        } catch ( error )
        {
            return null
            throw new HttpException( 'User already exists', HttpStatus.BAD_REQUEST )
        }
    }

    async findUserByEmail ( email: string )
    {
        try
        {
            return await this.prisma.user.findUnique( {
                where: {
                    email
                },
                select: this.SelectedOption
            } )
        } catch ( error )
        {
            return null

        }
    }
    async findWhenLogin ( email: string )
    {
        try
        {
            return await this.prisma.user.findUnique( {
                where: { email }
            } )
        } catch ( error )
        {
            if ( error instanceof Error )
            {
                throw new HttpException( error.message, HttpStatus.BAD_REQUEST )
            }
            throw new HttpException( 'User not found', HttpStatus.NOT_FOUND )
        }
    }

    async findUserById ( id: string )
    {
        try
        {
            return await this.prisma.user.findUnique( {
                where: {
                    id
                },
                select: this.SelectedOption
            } )
        } catch ( error )
        {
            if ( error instanceof Error )
            {
                throw new HttpException( error.message, HttpStatus.BAD_REQUEST )
            }
            throw new HttpException( 'User not found', HttpStatus.NOT_FOUND )
        }
    }

    async setRefreshToken ( id: string, refreshToken: string )
    {
        return await this.prisma.user.update( {
            where: {
                id
            },
            data: {
                refreshToken
            }
        } )
    }


    async setAvatarUrl ( id: string, avatarUrl: string )
    {
        return await this.prisma.user.update( {
            where: {
                id
            },
            data: {
                avatarUrl
            }
        } )
    }

    async deleteUser ( id: string )
    {
        return await this.prisma.user.update( {
            where: {
                id
            },
            data: {
                userStatus: 'DELETED',
                refreshToken: null
            }
        } )
    }



}