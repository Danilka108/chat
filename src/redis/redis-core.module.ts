import { DynamicModule, Global, Module } from '@nestjs/common'
import { RedisOptions } from 'ioredis'
import { createRedisClientProvider } from './redis-core.provider'

@Global()
@Module({})
export class RedisCoreModule {
    static forRoot(options: RedisOptions): DynamicModule {
        const redisClientProvider = createRedisClientProvider(options)
        return {
            module: RedisCoreModule,
            providers: [redisClientProvider],
            exports: [redisClientProvider],
        }
    }
}
