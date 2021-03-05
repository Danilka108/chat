import { Injectable, UnauthorizedException } from '@nestjs/common'
import { EmailLogicService } from 'src/email/email-logic.service'
import { RedisSessionService } from 'src/redis/services/redis-session.service'
import { TokenService } from 'src/token/token.service'
import { UserDBService } from 'src/user/user-db.service'
import { UserSocketManager } from 'src/user/user.socket-manager'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { IAuthResult } from './interface/auth-result.interface'

@Injectable()
export class AuthService {
    constructor(
        private readonly userDBService: UserDBService,
        private readonly redisSessionService: RedisSessionService,
        private readonly tokenService: TokenService,
        private readonly emailLogicService: EmailLogicService,
        private readonly userSocketManager: UserSocketManager
    ) {}

    async login({ email, password, os, browser }: LoginDto, ip: string) {
        const user = await this.userDBService.findByEmailNotException(email)
        if (!user) {
            throw new UnauthorizedException('Invalid password or email')
        }

        await this.userDBService.verifyPassword(
            {
                password,
                hashPassword: user.password,
            },
            'Invalid password or email'
        )

        await this.emailLogicService.verifyConfirmEmail(user.id)

        const { accessToken, refreshToken } = this.tokenService.createTokens(user.id)
        await this.redisSessionService.set({ userID: user.id, ip, os, browser }, refreshToken)

        const result: IAuthResult = {
            userID: user.id,
            accessToken,
            refreshToken,
        }

        return result
    }

    async refreshToken({ userID, os, browser, refreshToken }: RefreshTokenDto, ip: string) {
        const isVerify = await this.tokenService.verifyRefreshToken({ userID, ip, os, browser }, refreshToken)

        if (!isVerify) {
            this.userSocketManager.disconnectUserSessionSocket({ userID, os, browser, ip })
            throw new UnauthorizedException('Refresh token verify failed')
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this.tokenService.createTokens(userID)

        await this.redisSessionService.set({ userID, ip, os, browser }, newRefreshToken)

        const result: IAuthResult = {
            userID,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }

        return result
    }
}
