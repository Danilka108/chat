import { Module } from '@nestjs/common'
import { RedisService } from 'src/redis/redis.service'
import { TokenService } from './token.service'

@Module({
    providers: [TokenService, RedisService],
})
export class TokenModule {}
