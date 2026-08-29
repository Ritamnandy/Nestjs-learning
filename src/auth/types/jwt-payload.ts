/* eslint-disable prettier/prettier */


type JwtPayload = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

type RefreshTokenPayload = {
    id: string;
    email: string;
}

export type {
    JwtPayload,
    RefreshTokenPayload
}