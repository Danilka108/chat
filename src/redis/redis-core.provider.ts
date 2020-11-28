import { Provider } from '@nestjs/common'
import IORedis, { Redis } from 'ioredis'
import { REDIS_CLIENT } from './redis.constants'

export const createRedisClientProvider = (
    options: IORedis.RedisOptions
): Provider => ({
    useFactory: (): Redis => {
        const client = new IORedis(options)

        client.on('error', (error) => {
            console.error(error)
        })

        return client
    },
    provide: REDIS_CLIENT,
})
