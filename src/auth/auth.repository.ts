/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";
import type { RegisterDtoDto } from "./dto/register-dto.dto";

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
    }

    async findUserByEmail ( email: string )
    {
        return await this.prisma.user.findUnique( {
            where: {
                email
            },
            select: this.SelectedOption
        } )
    }
    async findWhenLogin ( email: string )
    {
        return await this.prisma.user.findUnique( {
            where: { email }
        } )
    }

    async findUserById ( id: string )
    {
        return await this.prisma.user.findUnique( {
            where: {
                id
            },
            select: this.SelectedOption
        } )
    }

    async setRefreshToken ( id: string, refreshToken: string | null )
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
                userStatus: 'DELETED'
            }
        } )
    }



}