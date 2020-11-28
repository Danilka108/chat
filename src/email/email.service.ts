import {
    BadRequestException,
    Inject,
    Injectable,
} from '@nestjs/common'
import { nanoid } from 'nanoid'
import Mail from 'nodemailer/lib/mailer'
import { config } from 'src/config'
import { RedisService } from 'src/redis/redis.service'
import { NODEMAILER_TRANSPORTER } from '../nodemailer/nodemailer.constants'

@Injectable()
export class EmailService {
    constructor(
        @Inject(NODEMAILER_TRANSPORTER)
        private readonly nodemailerTransporter: Mail,
        private readonly redisService: RedisService
    ) {}

    async sendConfirm(userID: number, address: string) {
        const confirmToken = nanoid(128)
        const { hostname } = config.app
        const { from } = config.email;

        const link = `http://${hostname}/api/email/confirm?userID=${userID}&confirmToken=${confirmToken}`

        await this.nodemailerTransporter.sendMail({
            from: `${from}`,
            to: address,
            subject: 'Verify email',
            text: `Verify email! Link is valid for 24 hours. ${link}`,
            html: `
				<h1>Verify email</h1>
				<p>Link is valid for 24 hours.</p>
				<a>${link}</a>
			`,
        })

        await this.redisService.setEmailConfirm(userID, confirmToken)
    }

    async confirm(userID: number, confirmToken: string) {
        const redisConfirmToken = await this.redisService.getEmailConfirm(
            userID
        )

        if (!redisConfirmToken) {
            throw new BadRequestException('Invalid id or token')
        }

        if (confirmToken !== redisConfirmToken) {
            throw new BadRequestException('Invalid id or token')
        }

        await this.redisService.delEmailConfirm(userID)
    }
}
