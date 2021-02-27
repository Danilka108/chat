import { Catch, UseFilters, UseGuards } from '@nestjs/common'
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
    BaseWsExceptionFilter,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WsDecoded } from 'src/common/decorator/ws-decoded.decorator'
import { WsIp } from 'src/common/decorator/ws-ip.decorator'
import { GatewayEvents } from 'src/common/events/gateway.events'
import { MyWsExceptionFilter } from 'src/common/filter/ws-exception.filter'
import { WsAuthGuard } from 'src/common/guard/ws-auth.guard'
import { IDecoded } from 'src/common/interface/decoded.interface'
import { IRedisSession } from 'src/redis/interface/redis-session.interface'
import { WsConnectUserDto } from './dto/ws-connect-user.dto'
import { UserSocketManager } from './user.socket-manager'

@WebSocketGateway()
export class UserGateway implements OnGatewayDisconnect {
    @WebSocketServer()
    private readonly socketServer!: Server

    constructor(private readonly userSocketManager: UserSocketManager) {}

    // @SubscribeMessage(GatewayEvents.user.connect)
    @UseGuards(WsAuthGuard)
    @SubscribeMessage('user:connect')
    handleUseConnect(
        @ConnectedSocket() socket: Socket
        // @MessageBody() { os, browser }: WsConnectUserDto
    ) {
        console.log('connect')
        // console.log(socket.handshake.query)
        // throw new WsException('its error')

        // const session: IRedisSession = {
        //     userID,
        //     os,
        //     browser,
        //     ip,
        // }

        // this.userSocketManager.addUserSessionSocket(session, socket)
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.userSocketManager.removeUserSessionSocket(socket)

        console.log(`user disconnected!`)
    }
}
