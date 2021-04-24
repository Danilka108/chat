import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import Mail from 'nodemailer/lib/mailer'
import { config } from 'src/config'
import { RedisChangeEmailService } from 'src/redis/services/redis-change-email.service'
import { RedisConfirmEmailService } from 'src/redis/services/redis-confirm-email.service'
import { RedisResetPasswordService } from 'src/redis/services/redis-reset-password.service'
import { TokenService } from 'src/token/token.service'
import { NODEMAILER_TRANSPORTER } from '../nodemailer/nodemailer.constants'
import { confirmEmailTemplate } from './templates/confirm-email.template'
import { resetPasswordTemplate } from './templates/reset-password.template'

@Injectable()
export class EmailLogicService {
    constructor(
        @Inject(NODEMAILER_TRANSPORTER)
        private readonly nodemailerTransporter: Mail,
        private readonly redisConfirmEmailService: RedisConfirmEmailService,
        private readonly redisResetPasswordService: RedisResetPasswordService,
        private readonly redisChangeEmailService: RedisChangeEmailService,
        private readonly tokenService: TokenService
    ) {}

    async sendConfirmEmail(userID: number, address: string) {
        try {
            const confirmToken = this.tokenService.createEmailToken()
            const { hostname } = config.app
            const { from } = config.email

            const link = `http://${hostname}/email/confirm-email?id=${userID}&token=${confirmToken}`

            await this.redisConfirmEmailService.set(userID, confirmToken)

            await this.nodemailerTransporter.sendMail({
                from: `Venerdichat <${from}>`,
                to: address,
                subject: 'Confirm Email',
                text: `Confirm email link: ${link}`,
                html: confirmEmailTemplate(link),
            })
        } catch (error) {
            throw new InternalServerErrorException(
                'Email sending error. Check if the email address you entered is correct'
            )
        }
    }

    async verifyConfirmEmail(userID: number) {
        const isConfirm = await this.redisConfirmEmailService.get(userID)
        if (isConfirm) {
            throw new UnauthorizedException('You need to confirm your email')
        }
    }

    async sendResetPassword(userID: number, address: string) {
        try {
            const resetToken = this.tokenService.createEmailToken()
            const { hostname } = config.app
            const { from, expiresInHours } = config.email

            const link = `http://${hostname}/email/reset-password?id=${userID}&token=${resetToken}`

            await this.redisResetPasswordService.set(userID, resetToken)

            await this.nodemailerTransporter.sendMail({
                from: `Venerdichat <${from}>`,
                to: address,
                subject: 'Reset password',
                text: `Reset password link: ${link}. Link is valid ${expiresInHours} hours`,
                html: resetPasswordTemplate(link, expiresInHours),
            })
        } catch (error) {}
    }

    async sendChangeEmail(userID: number, newAddress: string) {
        try {
            const changeEmailToken = this.tokenService.createEmailToken()
            const { port } = config.app
            const { from } = config.email

            const link = `http://localhost:${port}/api/email/change-email?id=${userID}&token=${changeEmailToken}`

            await this.redisChangeEmailService.set(userID, { token: changeEmailToken, email: newAddress })

            await this.nodemailerTransporter.sendMail({
                from: `Venerdichat <${from}>`,
                to: newAddress,
                subject: 'Confirm email',
                text: `Confirm email link: ${link}`,
                html: confirmEmailTemplate(link, true),
            })
        } catch (error) {
            throw new InternalServerErrorException('Email sending error')
        }
    }
}
