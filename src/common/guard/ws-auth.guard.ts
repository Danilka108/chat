import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { isJWT, isString } from 'class-validator'
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
        
        const sessionOS = client.handshake.query['os']
        const sessionBrowser = client.handshake.query['browser']

        if (!(sessionOS && isString(sessionOS)) || !(sessionBrowser || isString(sessionBrowser))) {
            client.emit('error:invalid_token')
            return false
        }

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
        client.handshake.sessionOS = sessionOS
        client.handshake.sessionBrowser = sessionBrowser

        return true
    }
}
