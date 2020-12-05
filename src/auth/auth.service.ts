import { Injectable } from '@nestjs/common'
import { EmailLogicService } from 'src/email/email.logic.service'
import { RedisSessionService } from 'src/redis/services/redis.session.service'
import { TokenService } from 'src/token/token.service'
import { UserDBService } from 'src/user/user.db.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { IAuthResult } from './interface/auth-result.interface'

@Injectable()
export class AuthService {
    constructor(
        private readonly userDBService: UserDBService,
        private readonly redisSessionService: RedisSessionService,
        private readonly tokenService: TokenService,
        private readonly emailLogicService: EmailLogicService
    ) {}

    async login({ email, password, os, browser }: LoginDto, ip: string) {
        const user = await this.userDBService.findByEmail(email, 'Invalid password or login')
        await this.userDBService.verifyPassword(password, user.password, 'Invalid password or login')

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
        await this.tokenService.verifyRefreshToken({ userID, ip, os, browser }, refreshToken)

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
