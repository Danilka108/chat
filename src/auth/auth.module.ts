import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { User } from '../user/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisService } from 'src/redis/redis.service'
import { TokenService } from 'src/token/token.service'
import { UserService } from 'src/user/user.service'
import { AuthService } from './auth.service'
import { EmailService } from 'src/email/email.service'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [
        RedisService,
        TokenService,
        UserService,
        AuthService,
        EmailService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
