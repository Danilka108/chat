import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IWsSession } from '../interface/ws-session.interface'

export const WsSession = createParamDecorator((_, ctx: ExecutionContext): IWsSession => {
    return {
        os: ctx.switchToWs().getClient().handshake.sessionOS as string,
        browser: ctx.switchToWs().getClient().handshake.sessionBrowser as string
    }
})
