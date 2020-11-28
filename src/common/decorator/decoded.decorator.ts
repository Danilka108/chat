import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IDecoded } from '../interface/decoded.interface'

interface IRequest extends Request {
    decoded: IDecoded
}

export const Decoded = createParamDecorator((_, ctx: ExecutionContext) => {
    const request: IRequest = ctx.switchToHttp().getRequest()

    return request.decoded
})
