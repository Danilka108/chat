import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT } from './redis.constants'
import { IRedisSession } from './interface/redis-session.interface'
import { config } from 'src/config'
import { IRedisChangeEmail } from './interface/redis-email-change.interface'

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

    // ===============
    // SESSION
    // ===============

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

    async setSession({ userID, ip, os, browser }: IRedisSession, token: string) {
        const { expiresIn, maxNum } = config.refreshToken

        const sessions = await this.getAllSessions(userID)

        if (sessions.length >= maxNum) {
            await Promise.all(sessions.map((key) => this.client.del(key)))
        }

        await this.client.set(`SESSION|:|${userID}|:|${ip}|:|${os}|:|${browser}`, token, 'EX', expiresIn)
    }

    async getSession({ userID, ip, os, browser }: IRedisSession): Promise<string | null> {
        const session = await this.client.get(`SESSION|:|${userID}|:|${ip}|:|${os}|:|${browser}`)

        if (!session) {
            return null
        }
        return session
    }

    async delAllSessions(userID: number) {
        const sessions = await this.getAllSessions(userID)

        await Promise.all(sessions.map((key) => this.client.del(key)))
    }

    // ===============
    // DELETE USER
    // ===============

    async setDeleteUser(userID: number) {
        const { expiresIn } = config.jwt
        const deleteExpiresIn = expiresIn * 1.5 * 1000

        await this.client.set(`DELETED|:|${userID}`, 'true', 'EX', deleteExpiresIn)
    }

    async isUserDeleted(userID: number) {
        const isDeleted = await this.client.get(`DELETED|:|${userID}`)

        return !!isDeleted
    }

    // ===============
    // CONFIRM EMAIL
    // ===============

    async setConfirmEmail(userID: number, token: string) {
        const { expiresIn } = config.email

        await this.client.set(`CONFIRM_EMAIL|:|${userID}`, token, 'EX', expiresIn)
    }

    async getConfirmEmail(userID: number) {
        return await this.client.get(`CONFIRM_EMAIL|:|${userID}`)
    }

    async delConfirmEmail(userID: number) {
        await this.client.del(`CONFIRM_EMAIL|:|${userID}`)
    }

    // ===============
    // RESET PASSWORD
    // ===============

    async setResetPassword(userID: number, token: string) {
        const { expiresIn } = config.email

        await this.client.set(`RESET_PASSWORD|:|${userID}`, token, 'EX', expiresIn)
    }

    async getResetPassword(userID: number) {
        return await this.client.get(`RESET_PASSWORD|:|${userID}`)
    }

    async delResetPassword(userID: number) {
        await this.client.del(`RESET_PASSWORD|:|${userID}`)
    }

    // ===============
    // CHANGE EMAIL
    // ===============

    async setChangeEmail(userID: number, { token, email }: { token: string; email: string }) {
        const { expiresIn } = config.email

        const data: IRedisChangeEmail = {
            token,
            email,
        }

        await this.client.set(`CHANGE_EMAIL|:|${userID}`, JSON.stringify(data), 'EX', expiresIn)
    }

    async getChangeEmail(userID: number) {
        const data = await this.client.get(`CHANGE_EMAIL|:|${userID}`)
        if (!data) return null

        const result: IRedisChangeEmail = JSON.parse(data)
        return result
    }

    async delChangeEmail(userID: number) {
        await this.client.del(`CHANGE_EMAIL|:|${userID}`)
    }
}
