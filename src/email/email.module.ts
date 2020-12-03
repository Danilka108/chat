import { Module } from '@nestjs/common'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { TokenService } from 'src/token/token.service'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [EmailService, RedisService, TokenService, UserService],
    controllers: [EmailController],
    exports: [EmailService],
})
export class EmailModule {}
