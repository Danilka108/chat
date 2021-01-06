import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SmtpOptions } from 'nodemailer-smtp-transport'
import { IAppConfig } from './app.config.interface'
import { IEmailConfig } from './email.config.interface'
import { IJwtConfig } from './jwt.config.interface'
import { IRefreshTokenConfig } from './refresh-token.config.interface'
import { RedisOptions } from 'ioredis'
import { IMessageConfig } from './message.config.interface'

export interface IConfig {
    app: IAppConfig
    db: TypeOrmModuleOptions
    redis: RedisOptions
    jwt: IJwtConfig
    refreshToken: IRefreshTokenConfig
    nodemailer: SmtpOptions
    email: IEmailConfig
    message: IMessageConfig
}
