import { WsExceptionFilter } from '@nestjs/common'
import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Catch(WsException)
export class MyWsExceptionFilter implements WsExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const client: Socket = host.switchToWs().getClient()

        console.log(exception)
    }
}
