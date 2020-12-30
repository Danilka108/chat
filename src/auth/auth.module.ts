import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserModule } from 'src/user/user.module'
import { RedisModule } from 'src/redis/redis.module'
import { TokenModule } from 'src/token/token.module'
import { EmailModule } from 'src/email/email.module'
import { AuthService } from './auth.service'

@Module({
    imports: [UserModule, RedisModule, TokenModule, EmailModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
