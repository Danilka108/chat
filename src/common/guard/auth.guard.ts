import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { IsJWT } from 'class-validator'
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
        const token = request.headers.authorization

        if (!token || !IsJWT(token)) {
            throw new BadRequestException('Access token Validation failed')
        }

        const decoded = await this.tokenService.verifyAccessToken(token.split(' ')[1])
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
