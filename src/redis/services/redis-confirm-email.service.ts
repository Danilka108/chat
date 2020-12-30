import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from '../redis.constants'

@Injectable()
export class RedisConfirmEmailService {
    constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

    async set(userID: number, token: string) {
        await this.client.set(`CONFIRM_EMAIL|:|${userID}`, token)
    }

    async get(userID: number) {
        return await this.client.get(`CONFIRM_EMAIL|:|${userID}`)
    }

    async del(userID: number) {
        await this.client.del(`CONFIRM_EMAIL|:|${userID}`)
    }
}
