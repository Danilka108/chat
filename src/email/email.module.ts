import { Module } from '@nestjs/common'
import { RedisService } from 'src/redis/redis.service'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'

@Module({
    providers: [EmailService, RedisService],
    controllers: [EmailController],
    exports: [EmailService],
})
export class EmailModule {}
