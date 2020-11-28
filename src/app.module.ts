import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { RedisModule } from './redis/redis.module'
import { NodemailerModule } from './nodemailer/nodemailer.module'
import { TokenModule } from './token/token.module'
import { config } from './config'
import { EmailModule } from './email/email.module'

@Module({
    imports: [
        TypeOrmModule.forRoot(config.db),
        RedisModule.forRoot(config.redis),
        NodemailerModule.forRoot(config.nodemailer),
        UserModule,
        AuthModule,
        TokenModule,
        EmailModule,
    ],
})
export class AppModule {}
