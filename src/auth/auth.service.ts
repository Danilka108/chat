import { Injectable } from '@nestjs/common'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'
import { TokenService } from 'src/token/token.service'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { IAuthResult } from './interface/auth-result.interface'

@Injectable()
export class AuthService {
    constructor(
        private readonly userSercive: UserService,
        private readonly redisService: RedisService,
        private readonly tokenService: TokenService,
        private readonly emailService: EmailService
    ) {}

    async login({ email, password, os, browser }: LoginDto, ip: string) {
        const user = await this.userSercive.findByEmail(email, 'Invalid password or login')
        await this.userSercive.verifyPassword(password, user.password, 'Invalid password or login')

        await this.emailService.verifyConfirmEmail(user.id)

        const { accessToken, refreshToken } = this.tokenService.createTokens(user.id)
        await this.redisService.setSession({ userID: user.id, ip, os, browser }, refreshToken)

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

        await this.redisService.setSession({ userID, ip, os, browser }, newRefreshToken)

        const result: IAuthResult = {
            userID,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }

        return result
    }
}
