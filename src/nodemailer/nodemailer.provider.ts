import { Provider } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { SmtpOptions } from 'nodemailer-smtp-transport'
import Mail from 'nodemailer/lib/mailer'
import { NODEMAILER_TRANSPORTER } from './nodemailer.constants'

export const createNodemailerProvider = (options: SmtpOptions): Provider => ({
    useFactory: (): Mail => {
        const transporter = nodemailer.createTransport(options)

        return transporter
    },
    provide: NODEMAILER_TRANSPORTER,
})
