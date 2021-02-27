import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IDecoded } from '../interface/decoded.interface'

export const WsDecoded = createParamDecorator((_, ctx: ExecutionContext) => {
    return ctx.switchToWs().getClient().handshake.decoded as IDecoded
})
