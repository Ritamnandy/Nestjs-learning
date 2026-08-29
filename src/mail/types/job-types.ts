/* eslint-disable prettier/prettier */

type wellComeEmailData = {
    email: string;
    name: string;

};

type sendVerifyEmailMailData = {
    email: string;
    token: string;
};

type sendResetPasswordMailData = {
    email: string;
    link: string;
};

type sendPasswordChangedMailData = {
    email: string;
};

export type {
    wellComeEmailData,
    sendVerifyEmailMailData,
    sendResetPasswordMailData,
    sendPasswordChangedMailData
}