import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from '../redis.constants'
import { config } from 'src/config'

@Injectable()
export class RedisDeleteUserService {
    constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

    async set(userID: number) {
        const { expiresIn } = config.jwt
        const deleteExpiresIn = expiresIn * 1.5 * 1000

        await this.client.set(`DELETED|:|${userID}`, 'true', 'EX', deleteExpiresIn)
    }

    async is(userID: number) {
        const isDeleted = await this.client.get(`DELETED|:|${userID}`)

        return !!isDeleted
    }
}
