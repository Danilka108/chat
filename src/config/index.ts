import { IConfig } from './interface/config.interface'
import * as dotenv from 'dotenv'
import { join } from 'path'

if (process.env.NODE_ENV === 'production') {
    dotenv.config({
        path: join(__dirname, '../..', 'prod.env'),
    })
} else {
    dotenv.config()
}

export const config: IConfig = {
    app: {
        port: Number(process.env.APP_PORT),
        hostname: process.env.APP_HOSTNAME as string,
    },
    db: {
        username: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string,
        type: process.env.DB_TYPE as 'postgres' | 'mysql',
        port: Number(process.env.DB_PORT),
        host: process.env.DB_HOST as string,
        synchronize: true,
        entities: ['dist/**/*.entity.{ts,js}'],
    },
    redis: {
        port: Number(process.env.REDIS_PORT),
    },
    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: 3600,
    },
    refreshToken: {
        expiresIn: 365 * 24 * 3600 * 1000,
        maxNum: 5,
    },
    nodemailer: {
        port: Number(process.env.NODEMAILER_HOST),
        host: process.env.NODEMAILER_HOST as string,
        // secure: true,
        auth: {
            user: process.env.NODEMAILER_USER as string,
            pass: process.env.NODEMAILER_PASSWORD as string,
        },
    },
    email: {
        expiresIn: 24 * 3600 * 1000,
        expiresInHours: 24,
        from: process.env.NODEMAILER_USER as string,
    },
    message: {
        maxLength: 4096,
    },
}
