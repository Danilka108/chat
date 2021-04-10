import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { isJWT } from 'class-validator'
import { RedisDeleteUserService } from 'src/redis/services/redis-delete-user.service'
import { TokenService } from 'src/token/token.service'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly redisDeleteUserService: RedisDeleteUserService,
        private readonly tokenService: TokenService
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const request = ctx.switchToHttp().getRequest()
        const token = (request.headers['authorization'] as string).split(' ')

        if (!token || token.length !== 2 || token[0] !== 'Bearer' || !isJWT(token[1])) {
            throw new UnauthorizedException('Access token Validation failed')
        }

        const decoded = await this.tokenService.verifyAccessToken(token[1])
        if (!decoded) {
            throw new UnauthorizedException('Authorization error')
        }

        const isDeleted = await this.redisDeleteUserService.is(decoded.userID)
        if (isDeleted) {
            throw new UnauthorizedException('Authorization error')
        }

        request.decoded = decoded

        return true
    }
}
