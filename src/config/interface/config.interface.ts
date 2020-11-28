import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SmtpOptions } from 'nodemailer-smtp-transport'
import { IAppConfig } from './app.config.interface'
import { IEmailConfig } from './email.config.interface'
import { IJwtConfig } from './jwt.config.interface'
import { IRedisConfig } from './redis.config.interface'
import { IRefreshTokenConfig } from './refresh-token.config.interface'

export interface IConfig {
    app: IAppConfig
    db: TypeOrmModuleOptions
    redis: IRedisConfig
    jwt: IJwtConfig
    refreshToken: IRefreshTokenConfig
    nodemailer: SmtpOptions
    email: IEmailConfig
}