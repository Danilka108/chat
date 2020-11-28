import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from './redis.constants'
import { IRedisSession } from './interface/redis-session.interface'
import { config } from 'src/config'

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

    private async getAllSessions(userID: number): Promise<string[]> {
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

    async setSession(
        { userID, ip, os, browser }: IRedisSession,
        refreshToken: string
    ) {
        const { expiresIn, maxNum } = config.refreshToken

        const sessions = await this.getAllSessions(userID)

        if (sessions.length >= maxNum) {
            await Promise.all(sessions.map((key) => this.client.del(key)))
        }

        await this.client.set(
            `SESSION|:|${userID}|:|${ip}|:|${os}|:|${browser}`,
            refreshToken,
            'EX',
            expiresIn
        )
    }

    async getSession({
        userID,
        ip,
        os,
        browser,
    }: IRedisSession): Promise<string | null> {
        const session = await this.client.get(
            `SESSION|:|${userID}|:|${ip}|:|${os}|:|${browser}`
        )

        if (!session) {
            return null
        }
        return session
    }

    async delAllSessions(userID: number) {
        const sessions = await this.getAllSessions(userID)

        await Promise.all(sessions.map((key) => this.client.del(key)))
    }

    async deleteUser(userID: number) {
        const { expiresIn } = config.jwt
        const deleteExpiresIn = expiresIn * 1.5 * 1000

        await this.client.set(
            `DELETED|:|${userID}`,
            'true',
            'EX',
            deleteExpiresIn
        )
    }

    async isUserDeleted(userID: number) {
        const isDeleted = await this.client.get(`DELETED|:|${userID}`)

        return !!isDeleted
    }

    async setEmailConfirm(userID: number, confirmToken: string) {
        const { expiresIn } = config.email

        await this.client.set(
            `EMAIL_CONFIRM|:|${userID}`,
            confirmToken,
            'EX',
            expiresIn
        )
    }

    async getEmailConfirm(userID: number) {
        return await this.client.get(`EMAIL_CONFIRM|:|${userID}`)
    }

    async delEmailConfirm(userID: number) {
        await this.client.del(`EMAIL_CONFIRM|:|${userID}`)
    }
}
