import { DynamicModule, Module } from '@nestjs/common'
import { RedisOptions } from 'ioredis'
import { RedisService } from './redis.service'
import { RedisCoreModule } from './redis-core.module'

@Module({})
export class RedisModule {
    static forRoot(options: RedisOptions): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisCoreModule.forRoot(options)],
            providers: [RedisService],
            exports: [RedisService],
        }
    }
}
