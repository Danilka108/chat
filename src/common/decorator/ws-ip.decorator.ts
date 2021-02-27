import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Socket } from 'socket.io'

export const WsIp = createParamDecorator((_, ctx: ExecutionContext) => {
    return (ctx.switchToWs().getClient() as Socket).handshake.address
})
