import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { isJWT } from 'class-validator'
import { RedisDeleteUserService } from 'src/redis/services/redis-delete-user.service'
import { TokenService } from 'src/token/token.service'

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(
        private readonly redisDeleteUserService: RedisDeleteUserService,
        private readonly tokenService: TokenService
    ) {}

    async canActivate(context: ExecutionContext) {
        const ctx = context.switchToWs()
        const client = ctx.getClient()
        const token = (client.handshake.query['authorization'] as string).split(' ')
        console.log(token)

        if (!token || !isJWT(token[1]) || token[0] !== 'Bearer' || token.length !== 2) {
            client.emit('error:invalid_token')
            return false
        }

        const decoded = await this.tokenService.verifyAccessToken(token[1])
        if (!decoded) {
            client.emit('error:invalid_token')
            return false
        }

        const isDeleted = await this.redisDeleteUserService.is(decoded.userID)
        if (isDeleted) {
            client.emit('error:invalid_token')
            return false
        }

        client.handshake.decoded = decoded

        return true
    }
}
