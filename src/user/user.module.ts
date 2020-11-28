import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './user.entity'
import { RedisService } from 'src/redis/redis.service'
import { TokenService } from 'src/token/token.service'
import { EmailService } from 'src/email/email.service'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, RedisService, TokenService, EmailService],
    controllers: [UserController],
})
export class UserModule {}
