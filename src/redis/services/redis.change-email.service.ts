import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from '../redis.constants'
import { config } from 'src/config'
import { IRedisChangeEmail } from '../interface/redis-email-change.interface'

@Injectable()
export class RedisChangeEmailService {
    constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

    async set(userID: number, { token, email }: { token: string; email: string }) {
        const { expiresIn } = config.email

        const data: IRedisChangeEmail = {
            token,
            email,
        }

        await this.client.set(`CHANGE_EMAIL|:|${userID}`, JSON.stringify(data), 'EX', expiresIn)
    }

    async get(userID: number) {
        const data = await this.client.get(`CHANGE_EMAIL|:|${userID}`)
        if (!data) return null

        const result: IRedisChangeEmail = JSON.parse(data)
        return result
    }

    async del(userID: number) {
        await this.client.del(`CHANGE_EMAIL|:|${userID}`)
    }
}
