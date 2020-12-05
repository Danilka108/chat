import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from '../redis.constants'
import { IRedisSession } from '../interface/redis-session.interface'
import { config } from 'src/config'

@Injectable()
export class RedisSessionService {
    constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

    private async getAll(userID: number): Promise<string[]> {
        const stream = this.client.scanStream({
            match: `SESSION|:|${userID}|:|*`,
        })

        return new Promise((resolve) => {
            let keys: string[] = []

            stream.on('data', (resultKeys: string[]) => {
                keys = resultKeys
            })

            stream.on('end', () => {
                resolve(keys)
            })
        })
    }

    async set({ userID, ip, os, browser }: IRedisSession, token: string) {
        const { expiresIn, maxNum } = config.refreshToken

        const sessions = await this.getAll(userID)

        if (sessions.length >= maxNum) {
            await Promise.all(sessions.map((key) => this.client.del(key)))
        }

        await this.client.set(`SESSION|:|${userID}|:|${ip}|:|${os}|:|${browser}`, token, 'EX', expiresIn)
    }

    async get({ userID, ip, os, browser }: IRedisSession): Promise<string | null> {
        const session = await this.client.get(`SESSION|:|${userID}|:|${ip}|:|${os}|:|${browser}`)

        if (!session) {
            return null
        }
        return session
    }

    async delAll(userID: number) {
        const sessions = await this.getAll(userID)

        await Promise.all(sessions.map((key) => this.client.del(key)))
    }
}
