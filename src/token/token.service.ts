import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { IRedisSession } from 'src/redis/interface/redis-session.interface'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { config } from 'src/config'
import { RedisSessionService } from 'src/redis/services/redis-session.service'

@Injectable()
export class TokenService {
    constructor(private readonly redisSessionService: RedisSessionService) {}

    createTokens(userID: number) {
        const { expiresIn: jwtExpiresIn, secret: jwtSecret } = config.jwt

        const accessToken = jwt.sign({ userID }, jwtSecret, {
            expiresIn: jwtExpiresIn,
        })
        const refreshToken = nanoid(128)

        return {
            accessToken,
            refreshToken,
        }
    }

    async verifyRefreshToken(
        { userID, ip, os, browser }: IRedisSession,
        refreshToken: string,
        errorMessage = 'Refresh token verify failed'
    ) {
        const session = await this.redisSessionService.get({
            userID,
            ip,
            os,
            browser,
        })

        if (!session) {
            throw new UnauthorizedException(errorMessage)
        }

        if (refreshToken !== session) {
            await this.redisSessionService.delAll(userID)
            throw new UnauthorizedException(errorMessage)
        }

        return true
    }

    async verifyAccessToken(accessToken: string): Promise<IDecoded | null> {
        const { secret } = config.jwt

        return new Promise((resolve) => {
            jwt.verify(accessToken, secret, {}, (error, decoded) => {
                if (error) {
                    resolve(null)
                }

                resolve(decoded as IDecoded)
            })
        })
    }

    createEmailToken() {
        return nanoid(128)
    }
}
