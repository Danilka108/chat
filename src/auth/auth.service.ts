import { Injectable, UnauthorizedException } from '@nestjs/common'
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
        private readonly tokenService: TokenService
    ) {}

    async login(loginDto: LoginDto, ip: string) {
        const { email, password, os, browser } = loginDto

        const user = await this.userSercive.findByEmail(
            email,
            'Invalid password or login'
        )
        await this.userSercive.verifyPassword(
            password,
            user.password,
            'Invalid password or login'
        )

        const { accessToken, refreshToken } = this.tokenService.createTokens(
            user.id
        )
        await this.redisService.setSession(
            { userID: user.id, ip, os, browser },
            refreshToken
        )

        const result: IAuthResult = {
            userID: user.id,
            accessToken,
            refreshToken,
        }

        return result
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto, ip: string) {
        const { userID, os, browser, refreshToken } = refreshTokenDto

        await this.tokenService.verifyRefreshToken(
            { userID, ip, os, browser },
            refreshToken
        )

        const {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        } = this.tokenService.createTokens(userID)

        await this.redisService.setSession(
            { userID, ip, os, browser },
            newRefreshToken
        )

        const result: IAuthResult = {
            userID,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }

        return result
    }
}
